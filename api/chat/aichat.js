import OpenAI from "openai";
import pool from '../../lib/db.js'
import js from "@eslint/js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // store in .env
});

export default async function handler(req, res) {
    
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, user_id , session_id } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }
    
    let dbcontext=''
    
    const result = await pool.query('SELECT * FROM news WHERE user_id=$1',[user_id]);
    await pool.query('insert into chat_messages (session_id,role,content) values ($1,$2,$3)',[session_id,'user',prompt]);
    let chathistory = await pool.query('select* from chat_messages where session_id=$1 order by created_at asc',[session_id])
    dbcontext = JSON.stringify(result.rows);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful and friendly chatbot." },
        {role:"system", content:`Here is the database context:${dbcontext}`},
        ...chathistory.rows.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: prompt },
      ],
    });
    const reply = completion.choices[0].message?.content || "I had trouble replying.";
    
    await pool.query('insert into chat_messages (session_id,role,content) values ($1,$2,$3)',[session_id,'assistant',reply]);
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("OpenAI API error:", err);
    return res.status(500).json({ error: "Failed to generate reply." });
  }
}
