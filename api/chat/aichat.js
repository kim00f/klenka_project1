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
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }
    let dbcontext=''
    const result = await pool.query('SELECT * FROM news ');
    dbcontext = JSON.stringify(result.rows);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful and friendly chatbot." },
        {role:"system", content:`Here is the database context:${dbcontext}`},
        { role: "user", content: prompt },
      ],
    });

    const reply = completion.choices[0].message?.content || "I had trouble replying.";
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("OpenAI API error:", err);
    return res.status(500).json({ error: "Failed to generate reply." });
  }
}
