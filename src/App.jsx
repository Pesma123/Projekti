import { useState, useRef, useEffect } from "react";
import { getAgentResponse, getModeratorVerdict, AGENT_STYLES } from "./debateEngine";
import "./App.css";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

const MAX_ROUNDS = 6;

function App() {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [streamingText, setStreamingText] = useState("");
  const [streamingAgent, setStreamingAgent] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [verdict, setVerdict] = useState("");
  const [isJudging, setIsJudging] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const [styleA, setStyleA] = useState("logical");
  const [styleB, setStyleB] = useState("aggressive");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, verdict]);

  const startDebate = async () => {
    if (!topic.trim()) return;
    setMessages([]);
    setVerdict("");
    setError("");
    setIsRunning(true);
    await runLoop([], 0);
  };

  const runLoop = async (history, currentRound) => {
    if (currentRound >= MAX_ROUNDS) {
      setIsRunning(false);
      await runModerator(history);
      return;
    }

    const agent = currentRound % 2 === 0 ? "Agent A" : "Agent B";
    const stance = currentRound % 2 === 0 ? "ZA temu" : "PROTIV teme";
    const selectedStyle = currentRound % 2 === 0 ? styleA : styleB;
    const styleInstruction = AGENT_STYLES[selectedStyle].instruction;

    setStreamingAgent(agent);
    setStreamingText("");

    try {
      const reply = await getAgentResponse(
        agent,
        stance,
        topic,
        history,
        (partial) => setStreamingText(partial),
        styleInstruction
      );

      const updatedHistory = [...history, { agent, content: reply }];
      setMessages(updatedHistory);
      setStreamingText("");
      setStreamingAgent(null);
      runLoop(updatedHistory, currentRound + 1);
    } catch (err) {
      setError("Ollama nije dostupna. Provjeri da li je 'ollama serve' pokrenut.");
      setIsRunning(false);
      setStreamingAgent(null);
    }
  };

  const runModerator = async (history) => {
    setIsJudging(true);
    try {
      const result = await getModeratorVerdict(topic, history);
      setVerdict(result);
    } catch (err) {
      setError("Greška pri generisanju presude.");
    }
    setIsJudging(false);
  };

  return (
    <div className="app">
      <h1>🎙️ AI Debate Simulator</h1>

      <div className="setup">
        <input
          type="text"
          placeholder="Unesi temu debate..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isRunning}
        />
        <button onClick={startDebate} disabled={isRunning || !topic.trim()}>
          {isRunning ? "Debata u toku..." : "Pokreni debatu"}
        </button>
      </div>

      <div className="style-picker">
        <div className="style-group">
          <label>Agent A stil:</label>
          <select value={styleA} onChange={(e) => setStyleA(e.target.value)} disabled={isRunning}>
            {Object.entries(AGENT_STYLES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
        <div className="style-group">
          <label>Agent B stil:</label>
          <select value={styleB} onChange={(e) => setStyleB(e.target.value)} disabled={isRunning}>
            {Object.entries(AGENT_STYLES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="chat">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`bubble ${msg.agent === "Agent A" ? "left" : "right"}`}
            >
              <div className="bubble-header">
                <span className={`avatar ${msg.agent === "Agent A" ? "a" : "b"}`}>
                  {msg.agent === "Agent A" ? "A" : "B"}
                </span>
                <strong>{msg.agent}</strong>
              </div>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </motion.div>
          ))}

          {streamingAgent && (
            <motion.div
              key="streaming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`bubble ${streamingAgent === "Agent A" ? "left" : "right"} streaming`}
            >
              <div className="bubble-header">
                <span className={`avatar ${streamingAgent === "Agent A" ? "a" : "b"}`}>
                  {streamingAgent === "Agent A" ? "A" : "B"}
                </span>
                <strong>{streamingAgent}</strong>
              </div>
              <p>{streamingText || "💭 thinking..."}<span className="cursor">▍</span></p>
            </motion.div>
          )}

          {isJudging && (
            <motion.div
              key="judging"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="verdict-box loading"
            >
              ⚖️ Moderator analizira debatu...
            </motion.div>
          )}

          {verdict && (
            <motion.div
              key="verdict"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="verdict-box"
            >
              <h3>⚖️ Presuda moderatora</h3>
              <ReactMarkdown>{verdict}</ReactMarkdown>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default App;