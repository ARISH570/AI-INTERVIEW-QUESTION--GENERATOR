import { useState } from "react";
import ReactMarkdown from "react-markdown";
import RESUME1 from "./assets/RESUME1.svg";
import RESUME2 from "./assets/RESUME2.svg";


function App() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [mode, setMode] = useState("questions"); // questions | ats
  const [jobDesc, setJobDesc] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===============================
  // Interview Question Generator
  // ===============================
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume PDF");
      return;
    }

    setLoading(true);
    setQuestions([]);
    setAtsResult(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch(
        "/api/upload",
        { method: "POST", body: formData }
      );
      const data = await response.json();
      setQuestions(data.questions.split("\n"));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ATS Analyzer
  // ===============================
  const handleATSAnalyze = async () => {
    if (!file || !jobDesc) {
      alert("Upload resume and paste job description");
      return;
    }

    setLoading(true);
    setQuestions([]);
    setAtsResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDesc);

    try {
      const response = await fetch(
        "/api/ats-analyze",
        { method: "POST", body: formData }
      );

      const data = await response.json();
      setAtsResult(data);
    } catch (error) {
      console.error("ATS Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-purple-50 relative overflow-hidden">
      <img
        src={RESUME1}
        alt="Interview Illustration"
        className="absolute inset-0 opacity-20 pointer-events-none z-0"
      />
      <div className="max-w-6xl mx-auto p-6 relative z-10">

        {/* ================= HERO SECTION ================= */}
        <header className="mb-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              AI Resume Assistant
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Analyze your resume with ATS logic and generate
              interview questions tailored for freshers.
            </p>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setMode("questions")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
              >
                Get Interview Questions
              </button>
              <button
                onClick={() => setMode("ats")}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
              >
                Check ATS Score
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src={RESUME2}
              alt="Interview"
              className="w-full opacity-90"
            />
          </div>
        </header>

        {/* ================= FEATURES ================= */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">📄 Resume Parsing</h3>
            <p className="text-gray-600 text-sm">
              Automatically extract skills, projects, and keywords from resumes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">📊 ATS Compatibility</h3>
            <p className="text-gray-600 text-sm">
              Check how well your resume matches a job description.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">🎯 Interview Prep</h3>
            <p className="text-gray-600 text-sm">
              Get fresher-level interview questions based on your profile.
            </p>
          </div>
        </div>


        {/* ================= CONTROLS ================= */}
        <div className="bg-white rounded-xl shadow p-8 mb-10 max-w-4xl mx-auto">
          <div className="flex gap-3 mb-5">
            <button
              onClick={() => setMode("questions")}
              className={`px-4 py-2 rounded-lg ${mode === "questions"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              Interview Questions
            </button>

            <button
              onClick={() => setMode("ats")}
              className={`px-4 py-2 rounded-lg ${mode === "ats"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              ATS Resume Analyzer
            </button>
          </div>

          {/* File Upload */}
          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">
              Upload Resume (PDF)
            </span>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-2 block w-full text-sm
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700"
            />
          </label>
          {file && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {file.name}
            </p>
          )}

          {mode === "ats" && (
            <textarea
              placeholder="Paste job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4"
              rows={5}
            />
          )}

          <button
            disabled={loading}
            onClick={mode === "questions" ? handleUpload : handleATSAnalyze}
            className={`px-6 py-2 rounded-lg text-white
    ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >

            {mode === "questions" ? "Generate Questions" : "Analyze Resume"}
          </button>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="animate-pulse space-y-3 max-w-md mx-auto">
            <div className="h-4 bg-gray-300 rounded" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
            <div className="h-4 bg-gray-300 rounded w-4/6" />
          </div>
        )}

        {/* ================= RESULTS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {mode === "questions" && questions.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6 col-span-2 transition-all duration-300 ease-in-out">
              <h2 className="text-xl font-semibold mb-4">
                Interview Questions
              </h2>
              <div className="prose max-w-none">
                <ReactMarkdown>
                  {questions.join("\n")}
                </ReactMarkdown>
              </div>

            </div>
          )}

          {mode === "ats" && atsResult && (
            <>
              <div className="bg-white rounded-xl shadow p-6 col-span-2 flex items-center gap-8">
                <div
                  className="relative w-32 h-32 rounded-full"
                  style={{
                    background: `conic-gradient(#22c55e ${atsResult.atsScore * 3.6}deg, #e5e7eb 0deg)`
                  }}
                >
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">
                      {atsResult.atsScore}%
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">ATS Compatibility Score</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Based on job description and resume keywords
                  </p>
                </div>
              </div>


              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-semibold mb-2">Matched Skills</h3>
                <p className="text-gray-600">
                  {atsResult.matchedSkills.join(", ")}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-semibold mb-2">Missing Skills</h3>
                <p className="text-gray-600">
                  {atsResult.missingSkills.join(", ")}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-5 col-span-2">
                <h3 className="font-semibold mb-2">Suggestions</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {atsResult.improvementSuggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* ================= EMPTY STATE ================= */}
        {!loading && questions.length === 0 && !atsResult && (
          <div className="text-center text-gray-400 mt-16">
            <img
              src={RESUME2}
              alt="Upload Resume"
              className="w-52 mx-auto mb-4 opacity-80"
            />
            <p className="text-lg">
              Upload a resume to get started 🚀
            </p>
          </div>
        )}
      </div>
      <footer className="text-center text-gray-400 text-sm mt-20">
        © 2026 AI Resume Assistant · Built by Arish
      </footer>

    </div>
  );
}

export default App;
