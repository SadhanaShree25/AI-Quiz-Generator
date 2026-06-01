import React, { useState, useRef } from "react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function PdfQuizForm({ onQuizGenerated }) {
  const { theme } = useTheme();
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState("5");
  const [quizType, setQuizType] = useState("Multiple Choice");
  
  // Pipeline processing orchestration states: "idle" | "reading" | "analyzing" | "generating" | "success"
  const [processStage, setProcessStage] = useState("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [cachedQuestions, setCachedQuestions] = useState(null);

  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (targetFile) => {
    if (!targetFile) return;
    if (targetFile.type !== "application/pdf") {
      alert("Invalid format stream mapping. Target structural object must be a valid PDF document.");
      return;
    }
    if (targetFile.size > 5 * 1024 * 1024) {
      alert("File payload allocation out of bounds. Maximum operational threshold is 5MB.");
      return;
    }
    setFile(targetFile);
    // Reset pipeline layout states if a new file gets queued up
    if (processStage === "success") {
      setProcessStage("idle");
      setCachedQuestions(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload or deposit a target PDF context frame file first.");
      return;
    }

    // Begin timed artificial pipeline orchestration updates to guide the user sequentially
    setProcessStage("reading");

    const stageTimer1 = setTimeout(() => setProcessStage("analyzing"), 2000);
    const stageTimer2 = setTimeout(() => setProcessStage("generating"), 4500);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("numQuestions", Number(numQuestions));
    formData.append("quizType", quizType);
    formData.append("difficulty", "medium"); // Safe baseline parameter wrapper fallback

    try {
      const res = await api.post("/quiz/generate-quiz", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);

      const targetQuestions = Array.isArray(res.data) ? res.data : res.data?.questions;

      if (Array.isArray(targetQuestions) && targetQuestions.length > 0) {
        setGeneratedCount(targetQuestions.length);
        setCachedQuestions(targetQuestions);
        setProcessStage("success");
      } else {
        throw new Error("Empty query matrix returned from parsing microservice mapping.");
      }
    } catch (error) {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setProcessStage("idle");
      const msg = error.response?.data?.message || error.message || "PDF parsing pipeline breakdown.";
      alert(msg);
    }
  };

  const triggerStartQuiz = () => {
    if (cachedQuestions) {
      onQuizGenerated({
        questions: cachedQuestions,
        topic: file ? file.name.replace(".pdf", "") : "PDF Extraction Context",
        difficulty: "PDF Tier",
      });
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* IMMERSIVE AI MULTI-STAGE PROCESSING LAYER MODULE */}
      {["reading", "analyzing", "generating"].includes(processStage) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]/95 backdrop-blur-2xl">
          <div className="relative h-28 w-28 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full animate-pulse duration-1000" />
            <div className="absolute inset-2 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin duration-700" />
            <span className="text-3xl animate-bounce">📑</span>
          </div>

          <div className="text-center space-y-2 max-w-xs">
            <div className={`text-lg font-black tracking-wide transition-all ${processStage === "reading" ? "text-blue-400" : "text-zinc-500"}`}>
              {processStage === "reading" ? "⚡ Reading Context PDF..." : "✓ File Decoded Successfully"}
            </div>
            <div className={`text-lg font-black tracking-wide transition-all ${processStage === "analyzing" ? "text-indigo-400" : processStage === "generating" ? "text-zinc-300" : "text-zinc-500"}`}>
              {processStage === "analyzing" ? "🧠 Analyzing Document Semantics..." : processStage === "generating" ? "✓ Core Context Map Processed" : "⏳ Queueing Extraction Model"}
            </div>
            <div className={`text-lg font-black tracking-wide transition-all ${processStage === "generating" ? "text-purple-400 animate-pulse" : "text-zinc-600"}`}>
              {processStage === "generating" ? "✨ Synthesizing Questions..." : "⏳ Building Structural Blueprints"}
            </div>
          </div>

          <div className="w-56 h-1.5 bg-zinc-900 rounded-full overflow-hidden mt-8 border border-zinc-800/40">
            <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full animate-infinite-loading" />
          </div>
        </div>
      )}

      {/* STATE PANEL 2: PIPELINE EXTRACTION RUN SUCCESS PORTAL */}
      {processStage === "success" && (
        <div className={`border rounded-3xl p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden animate-in zoom-in-95 duration-400 ${
          theme === "dark" ? "bg-[#11111a]/60 border-zinc-800/80" : "bg-white border-gray-200 shadow-xl"
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex h-16 w-16 items-center justify-center bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-2xl mb-4 text-emerald-400">
            ✓
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${
            theme === "dark" ? "text-zinc-100" : "text-gray-900"
          }`}>
            PDF Processed Successfully
          </h2>
          <p className={`text-sm mt-1 max-w-sm mx-auto ${
            theme === "dark" ? "text-zinc-500" : "text-gray-500"
          }`}>
            The vector embedding engine finished scanning your files and maps objects into clean logical sets.
          </p>

          <div className={`my-8 inline-block border rounded-2xl px-8 py-4 shadow-inner ${
            theme === "dark" ? "bg-[#0a0a0f] border-zinc-800" : "bg-gray-50 border-gray-200"
          }`}>
            <div className={`text-[10px] uppercase font-black tracking-widest mb-0.5 ${
              theme === "dark" ? "text-zinc-500" : "text-gray-500"
            }`}>Questions Generated</div>
            <div className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${
              theme === "dark" ? "from-emerald-400 to-teal-400" : "from-emerald-600 to-teal-600"
            }`}>{generatedCount}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto justify-center">
            <button
              onClick={() => setProcessStage("idle")}
              className={`px-6 py-3.5 border rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                theme === "dark"
                  ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-800"
              }`}
            >
              Upload New Document
            </button>
            <button
              onClick={triggerStartQuiz}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-xl font-black text-xs tracking-widest uppercase transition-transform active:scale-95 shadow-xl shadow-indigo-600/20"
            >
              Start Quiz 🚀
            </button>
          </div>
        </div>
      )}

      {/* STATE PANEL 1: DEFAULT CONFIGURATION RUN SUBMISSION PANEL */}
      {processStage === "idle" && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className={`text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r tracking-tight ${
              theme === "dark" ? "from-white via-zinc-200 to-zinc-400" : "from-gray-900 via-gray-700 to-gray-500"
            }`}>
              Generate Quiz from PDF
            </h1>
            <p className={`text-sm sm:text-base max-w-md mx-auto leading-relaxed ${
              theme === "dark" ? "text-zinc-400" : "text-gray-500"
            }`}>
              Upload study materials and let AI create questions directly from your content.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={`rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-8 border ${
            theme === "dark" ? "bg-[#11111a]/60 border-zinc-800/80" : "bg-white border-gray-200"
          }`}>
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-full blur-3xl pointer-events-none" />

            {/* DRAG AND DROP CAPTURE CONTAINER */}
            <div className="space-y-3">
              <label className={`block text-xs font-black uppercase tracking-widest ${
                theme === "dark" ? "text-zinc-500" : "text-gray-500"
              }`}>Target Context File</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[180px] group ${
                  isDragging 
                    ? "border-blue-500 bg-blue-500/5" 
                    : file 
                    ? "border-indigo-500/40 bg-indigo-500/5" 
                    : theme === "dark"
                    ? "border-zinc-800 bg-[#0a0a0f]/40 hover:border-zinc-700 hover:bg-[#0a0a0f]/70"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/50"
                }`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />
                
                <span className={`text-4xl mb-3 transition-transform duration-300 group-hover:scale-110 ${file ? "animate-pulse" : ""}`}>
                  {file ? "📑" : "📂"}
                </span>

                <div className="space-y-1.5">
                  <h4 className={`text-sm font-bold ${
                    theme === "dark" ? "text-zinc-200" : "text-gray-800"
                  }`}>
                    {file ? file.name : "Upload PDF"}
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium max-w-xs">
                    {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB / Payload Verified` : "Drag & drop your PDF here or click to browse."}
                  </p>
                </div>
                
                <div className={`mt-4 px-2.5 py-1 border rounded-md text-[9px] font-black tracking-widest uppercase ${
                  theme === "dark" ? "bg-zinc-900 border-zinc-800/60 text-zinc-500" : "bg-gray-100 border-gray-200 text-gray-500"
                }`}>
                  PDF format limits under 5MB
                </div>
              </div>
            </div>

            {/* SPLIT SETTINGS CONTAINER FORM CARD */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t ${
              theme === "dark" ? "border-zinc-800/40" : "border-gray-200"
            }`}>
              {/* FIELD 1: NUM QUESTIONS */}
              <div className="space-y-3">
                <label className={`block text-xs font-black uppercase tracking-widest ${
                  theme === "dark" ? "text-zinc-500" : "text-gray-500"
                }`}>Question Count</label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className={`w-full p-4 border rounded-xl focus:border-indigo-500/60 focus:outline-none text-sm font-semibold appearance-none cursor-pointer tracking-wide ${
                    theme === "dark"
                      ? "bg-[#0a0a0f]/80 border-zinc-800 text-zinc-200"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="15">15 Questions</option>
                  <option value="20">20 Questions</option>
                </select>
              </div>

              {/* FIELD 2: QUESTION TYPE SELECT */}
              <div className="space-y-3">
                <label className={`block text-xs font-black uppercase tracking-widest ${
                  theme === "dark" ? "text-zinc-500" : "text-gray-500"
                }`}>Question Blueprint</label>
                <select
                  value={quizType}
                  onChange={(e) => setQuizType(e.target.value)}
                  className={`w-full p-4 border rounded-xl focus:border-indigo-500/60 focus:outline-none text-sm font-semibold appearance-none cursor-pointer tracking-wide ${
                    theme === "dark"
                      ? "bg-[#0a0a0f]/80 border-zinc-800 text-zinc-200"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                >
                  <option value="Multiple Choice">Multiple Choice (MCQ)</option>
                  <option value="True/False">True / False</option>
                  <option value="Mixed">Mixed Structuring</option>
                </select>
              </div>
            </div>

            {/* TRIGGER SUBMIT RUN */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!file}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 disabled:from-zinc-800 disabled:to-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed disabled:shadow-none text-white py-4 sm:py-5 rounded-2xl font-black text-sm tracking-widest uppercase transition-all duration-300 shadow-xl shadow-indigo-600/20 transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Generate Questions 🚀
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}