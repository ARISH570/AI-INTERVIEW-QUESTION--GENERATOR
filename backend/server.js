require("dotenv").config();
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const upload = multer({ dest: "uploads/" });

// ✅ Load API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY in .env file");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.use(express.json());
app.use(cors());

// ✅ Upload PDF and generate interview questions
app.post("/upload", upload.single("resume"), async (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded");

    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Generate as much as you need the interview questions based on this resume:\n${pdfData.text}`;

        const response = await model.generateContent(prompt);
        const textResponse = response.response.text(); // ✅ Correct response handling

        res.json({ questions: textResponse });

    } catch (error) {
        console.error("❌ Error generating questions:", error);
        res.status(500).send("Failed to generate questions.");
    }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
