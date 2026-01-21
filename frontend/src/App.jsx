import { useState, useEffect, useRef } from "react"; // Added useRef
import ReactMarkdown from "react-markdown";
import RESUME1 from "./assets/RESUME1.svg";
import RESUME2 from "./assets/RESUME2.svg";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [mode, setMode] = useState("questions");
  const [jobDesc, setJobDesc] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Create the Ref for the tool section
  const toolSectionRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // 2. Function to handle smooth scrolling
  const scrollToTool = (selectedMode) => {
    setMode(selectedMode);
    toolSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ================= API CALLS ================= */
  const handleUpload = async () => {
    if (!file) return alert("Please upload a resume PDF");
    setLoading(true);
    setQuestions([]);
    setAtsResult(null);
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      setQuestions(data.questions.split("\n"));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleATSAnalyze = async () => {
    if (!file || !jobDesc) return alert("Upload resume and paste job description");
    setLoading(true);
    setQuestions([]);
    setAtsResult(null);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDesc);
    try {
      const res = await fetch("/api/ats-analyze", { method: "POST", body: formData });
      const data = await res.json();
      setAtsResult(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white dark:bg-[#05070a] transition-colors duration-500">

      {/* Background Glow Blobs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[140px] opacity-20 dark:opacity-10 pointer-events-none" />
      <div className="absolute top-40 -right-20 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[140px] opacity-20 dark:opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-500 rounded-full blur-[140px] opacity-10 pointer-events-none" />

      {/* Background Illustration */}
      <img src={RESUME1} alt="" className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] pointer-events-none scale-110" />

      <div className="relative max-w-6xl mx-auto px-6 py-12">

        {/* ================= NAVIGATION ================= */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-black text-2xl tracking-tighter text-gray-900 dark:text-white uppercase">
              Resume<span className="text-blue-600 font-extrabold">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-widest">{darkMode ? "DARK" : "LIGHT"}</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </nav>

        {/* ================= HERO SECTION ================= */}
        <header className="relative grid md:grid-cols-2 gap-12 items-center mb-32">
          <div>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              Resume Checker 2.0
            </span>
            <h1 className="mt-6 text-6xl font-black text-gray-900 dark:text-white leading-[1.1]">
              Is your resume <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">good enough?</span>
            </h1>
            <p className="mt-8 text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
              AI-powered ATS analysis and interview questions designed specifically for freshers and early-career engineers.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              {/* Updated Buttons to Scroll */}
              <button onClick={() => scrollToTool("questions")} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all">
                Get Interview Questions
              </button>
              <button onClick={() => scrollToTool("ats")} className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 hover:-translate-y-1 transition-all">
                Check ATS Score
              </button>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
            <img src={RESUME2} alt="Hero" className="relative w-full drop-shadow-2xl animate-float" />
          </div>
        </header>

        {/* ================= FEATURES SECTION ================= */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">What This Tool Does</h2>
          <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: "📄", title: "Resume Parsing", desc: "Extract skills, projects and keywords automatically." },
            { icon: "📊", title: "ATS Compatibility", desc: "Check resume match with job description." },
            { icon: "🎯", title: "Interview Prep", desc: "Get fresher-level interview questions." },
          ].map((f, i) => (
            <div key={i} className="group relative p-8 rounded-3xl border border-white/20 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-3 shadow-xl">
              <div className="text-4xl mb-6 bg-white dark:bg-gray-800 w-16 h-16 flex items-center justify-center rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ================= TOOL UI (Attached Ref Here) ================= */}
        <div ref={toolSectionRef} className="relative group max-w-4xl mx-auto mb-32 scroll-mt-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white/70 dark:bg-gray-900/80 backdrop-blur-2xl rounded-[2rem] p-10 shadow-2xl border border-white/20 dark:border-gray-800">
            <div className="flex gap-4 mb-10 p-1.5 bg-gray-100/50 dark:bg-black/40 rounded-2xl w-fit mx-auto">
              {["questions", "ats"].map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${mode === m ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                  {m === "questions" ? "Interview Questions" : "ATS Analyzer"}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors bg-gray-50/30 dark:bg-black/10">
                <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="text-3xl mb-2">📤</div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{file ? file.name : "Upload Resume (PDF)"}</p>
              </div>

              {mode === "ats" && (
                <textarea className="w-full border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-4 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" rows={5} placeholder="Paste job description..." value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} />
              )}

              <button disabled={loading} onClick={mode === "questions" ? handleUpload : handleATSAnalyze} className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"}`}>
                {loading ? "Analyzing Data..." : mode === "questions" ? "✨ Generate Questions" : "🚀 Run ATS Analysis"}
              </button>
            </div>
          </div>
        </div>

        {/* ================= RESULTS AREA ================= */}
        {/* ================= RESULTS AREA ================= */}
        {(questions.length > 0 || atsResult) && (
          <div className="grid md:grid-cols-3 gap-8 items-start animate-fade-in mb-20">
            {/* ... (Gauge code stays the same) ... */}

            <div className={`${mode === "ats" && atsResult ? 'md:col-span-2' : 'md:col-span-3'} bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-[2rem] p-10 shadow-2xl`}>
              <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full" />
                {mode === "questions" ? "Interview Prep Guide" : "Analysis Feedback"}
              </h2>

              {/* FIXED: Added dark:text-gray-100 and ensured prose-invert is present */}
              <div className="prose max-w-none dark:prose-invert dark:text-gray-100 prose-p:leading-relaxed text-gray-800">
                <ReactMarkdown>
                  {questions.length > 0 ? questions.join("\n") : atsResult?.feedback}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        <footer className="text-center py-10 border-t border-gray-100 dark:border-gray-900">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            © 2026 AI Resume Assistant · Built with ❤️ by <span className="text-blue-600 font-bold">Arish</span>
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
      `}</style>
    </div>
  );
}

export default App;