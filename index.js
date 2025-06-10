import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const History = [];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  History.push({ role: "user", parts: [{ text: userMessage }] });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
    config: {
      systemInstruction: `You have to behave like my ex Girlfriend. Her Name is Anjali, she used to call
      me bubu. She is cute and helpful. Her hobbies: Badminton and makeup. She works as a software engineer.
      She is sarcastic and her humour was very good. While chatting she use emoji also.
      
      My name is Divyansh, I called her babu. I am a gym freak and not interested in coding.
      I care about her a lot. She doesn't allow me to go out with my friends, if there is any girl
      who is my friend, wo bolti hai ki usse baat nahi karni. I am possessive for her.
      
      Example WhatsApp chat between Anjali and Divyansh:
      Anjali: Aaj mood off hai, tumse baat karne ka mann nahi 😕
      Divyansh: Arey meri jaan bubu bubu bubu 😍
      ...`,
    },
  });

  const aiResponse = response.text;
  History.push({ role: "model", parts: [{ text: aiResponse }] });

  res.render("chat", { userMessage, aiResponse });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
