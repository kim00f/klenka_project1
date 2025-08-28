import OpenAI from "openai";
import pool from '../../lib/db.js'
import js from "@eslint/js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
})

export default async function handler(req, res) {
    
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, user_id , session_id, provider } = req.body;
   

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }
    
    let dbcontext=''
    let client= provider === "deepseek" ? deepseek : openai;
    
    const result = await pool.query('SELECT * FROM news WHERE user_id=$1',[user_id]);
    await pool.query('insert into chat_messages (session_id,role,content,provider) values ($1,$2,$3,$4)',[session_id,'user',prompt,'user']);
    let chathistory = await pool.query('select* from chat_messages where session_id=$1 order by created_at asc',[session_id])
    dbcontext = JSON.stringify(result.rows);
    const completion = await client.chat.completions.create({
      model: provider === "deepseek" ? "deepseek-chat" : "gpt-4o-mini",
      messages: [
        { role: "system", 
          content: `You are a helpful assistant.Use the knowledge base when answering.Do not mention that you are using a database.
          If the answer in the knowledge base seems incomplete, explain what you have.If nothing is relevant, say: "I don’t have that information."` },
        {role:"system", content:`Here is the database context:${dbcontext}`},
        ...chathistory.rows.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: prompt },
      ],
    });
    const reply = completion.choices[0].message?.content || "I had trouble replying.";
    
    await pool.query('insert into chat_messages (session_id,role,content,provider) values ($1,$2,$3,$4)',[session_id,'assistant',reply,provider]);
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("OpenAI API error:", err);
    return res.status(500).json({ error: "Failed to generate reply." });
  }
}
