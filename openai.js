import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  store: true,
  messages: [{ role: "user", content: "write a haiku about ai" }],
});
console.log(completion.data.choices[0].message.content);