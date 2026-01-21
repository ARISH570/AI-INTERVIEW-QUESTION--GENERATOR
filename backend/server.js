require("dotenv").config();
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

const upload = multer({ dest: "uploads/" });

// ✅ Load API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY in .env file");
    process.exit(1);
}

// ✅ Initialize Gemini client (NEW SDK)
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
app.use(express.json());
app.use(cors());

/* =========================================================
   1️⃣ AI INTERVIEW QUESTION GENERATOR
========================================================= */
app.post("/api/upload", upload.single("resume"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);

        const prompt = `
Generate interview questions suitable for a fresher based on this resume.
Focus on skills, projects, fundamentals, and basic problem-solving.

Resume:
${pdfData.text}
    `;

        // ✅ NEW SDK CALL
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        res.json({ questions: textResponse });

    } catch (error) {
        console.error("❌ Error generating questions:", error);
        res.status(500).send("Failed to generate questions.");
    }
});

/* =========================================================
   2️⃣ AI-POWERED ATS RESUME ANALYZER
========================================================= */
app.post("/api/ats-analyze", upload.single("resume"), async (req, res) => {
    if (!req.file || !req.body.jobDescription) {
        return res.status(400).json({
            error: "Resume PDF and Job Description are required",
        });
    }

    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);

        const prompt = `
You are an Applicant Tracking System (ATS) for fresher-level job candidates.

Analyze the resume against the job description.
Respond ONLY in valid JSON with the following fields:
{
  "atsScore": number,
  "matchedSkills": array,
  "missingSkills": array,
  "strengths": array,
  "improvementSuggestions": array,
  "finalVerdict": string
}

Do not penalize for lack of experience.
Focus on skills, projects, keywords, and fundamentals.

Resume:
${pdfData.text}

Job Description:
${req.body.jobDescription}
    `;

        // ✅ NEW SDK CALL
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            generationConfig: { responseMimeType: "application/json" }
        });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // 🛡️ Extract JSON safely
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}") + 1;
        const jsonString = text.substring(jsonStart, jsonEnd);

        const atsResult = JSON.parse(jsonString);

        res.json(atsResult);

    } catch (error) {
        console.error("❌ ATS Error:", error);
        res.status(500).json({ error: "ATS analysis failed" });
    }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
