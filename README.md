# 🎙️ AI Debate Simulator

A real-time debate simulator where two AI agents argue opposing sides of any topic, complete with customizable personalities and an AI moderator that judges the winner — powered entirely by a locally-hosted LLM.

![Demo](demo.gif)

## Why I built this

I wanted to explore multi-agent AI orchestration beyond a simple chatbot wrapper — building a system where multiple AI "personas" interact with each other, maintain conversational context, and produce a structured outcome (a verdict), all while running 100% locally with no API costs.

## Features

- 🤖 **Two AI agents** debate opposing positions on any topic you provide
- 🎭 **Customizable personalities** — choose each agent's debate style (Logical, Aggressive, Sarcastic, Academic, Diplomatic)
- ⚖️ **AI Moderator** — a third agent analyzes the full debate and declares a winner with reasoning
- ⚡ **Real-time streaming** — responses appear token-by-token, just like ChatGPT
- 🎨 **Smooth animations** — powered by Framer Motion for a polished feel
- 🏠 **Fully local** — runs on Ollama, no API keys, no costs, works offline

## Tech Stack

- **Frontend:** React + Vite
- **AI Engine:** Ollama (Llama 3.2) running locally
- **Animations:** Framer Motion
- **Markdown rendering:** react-markdown

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Ollama](https://ollama.com/) installed locally

## Getting Started

**1. Clone the repo**
```bash
git clone https://github.com/YOUR_USERNAME/ai-debate-simulator.git
cd ai-debate-simulator
```

**2. Install dependencies**
```bash
npm install
```

**3. Pull the AI model**
```bash
ollama pull llama3.2
```

**4. Start Ollama** (in a separate terminal)
```bash
ollama serve
```

**5. Run the app**
```bash
npm run dev
```

Open `http://localhost:5173` and start debating.

## How it works

1. User enters a topic and selects a debate style for each agent
2. Agent A and Agent B take turns generating arguments, each responding to the previous point
3. Responses stream in real-time via Ollama's chat API
4. After a set number of rounds, a third "Moderator" agent analyzes the full transcript and declares a winner

## Roadmap

- [ ] PDF export of debate transcripts
- [ ] Text-to-speech for agent responses
- [ ] Cloud fallback (Groq API) when Ollama is unavailable
- [ ] Multi-agent debates (3+ perspectives)

## License

MIT