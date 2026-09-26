import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleUpload = async () => {
    if (!file) return
    setUploadStatus('Uploadujem i obrađujem PDF...')
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    setUploadStatus(`✅ ${data.filename} — ${data.chunks} dijelova teksta`)
  }

  const handleAsk = async () => {
    if (!input.trim()) return
    const question = input
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setInput('')
    setLoading(true)

    const res = await fetch('http://localhost:8000/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    })
    const data = await res.json()
    setMessages(prev => [...prev, { role: 'bot', text: data.answer }])
    setLoading(false)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">📚</div>
        <div>
          <h1>RAG Bot</h1>
          <p className="subtitle">Postavi pitanje o svom PDF-u</p>
        </div>
      </header>

      <div className="upload-card">
        <label className="file-label">
          <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} hidden />
          📄 {file ? file.name : 'Izaberi PDF fajl'}
        </label>
        <button className="upload-btn" onClick={handleUpload}>Uploaduj</button>
        {uploadStatus && <p className="status">{uploadStatus}</p>}
      </div>

      <div className="chat-box">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>💬 Postavi svoje prvo pitanje ispod</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`message-row ${m.role}`}>
            <div className="avatar">{m.role === 'user' ? '🧑' : '🤖'}</div>
            <div className={`bubble ${m.role}`}>{m.text}</div>
          </div>
        ))}

        {loading && (
          <div className="message-row bot">
            <div className="avatar">🤖</div>
            <div className="bubble bot typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
          placeholder="Postavi pitanje..."
        />
        <button onClick={handleAsk} disabled={loading}>Pošalji</button>
      </div>
    </div>
  )
}

export default App