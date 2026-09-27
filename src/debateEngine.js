const API_URL = "http://localhost:11434/api/chat";
const MODEL = "llama3.2";

export const AGENT_STYLES = {
  logical: {
    label: "🧠 Logical",
    instruction: "Be calm, analytical, and rely strictly on logic, facts, and evidence."
  },
  aggressive: {
    label: "🔥 Aggressive",
    instruction: "Be blunt, assertive, and challenge your opponent's points directly and forcefully."
  },
  sarcastic: {
    label: "😏 Sarcastic",
    instruction: "Use dry wit, irony, and sarcasm while still making substantive points."
  },
  academic: {
    label: "🎓 Academic",
    instruction: "Speak formally, cite general principles, and structure your reasoning like a scholar."
  },
  diplomatic: {
    label: "🤝 Diplomatic",
    instruction: "Be measured and respectful, acknowledge nuance, but still firmly defend your position."
  }
};


export async function getAgentResponse(agentLabel, stance, topic, history, onToken, styleInstruction) {
  const systemPrompt = `You are ${agentLabel} in a debate about: "${topic}".
Your position is: ${stance}.
STYLE: ${styleInstruction}
Use concrete facts and examples. Write short, clear sentences.
Respond in maximum 3-4 sentences, in English.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(h => ({
      role: h.agent === agentLabel ? "assistant" : "user",
      content: h.content
    }))
  ];

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
      options: { temperature: 0.8 }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama greška: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // zadnja (nepotpuna) linija ostaje u bufferu

    for (const line of lines) {
      if (!line.trim()) continue;
      const json = JSON.parse(line);
      if (json.message?.content) {
        fullText += json.message.content;
        onToken(fullText);
      }
    }
  }

  // Očisti eventualni "assistant" prefiks
  fullText = fullText.replace(/^(assistant|user|system)\s*[:.]?\s*/i, "").trim();
  return fullText;
}

export async function getModeratorVerdict(topic, history) {
  const transcript = history.map(h => `${h.agent}: ${h.content}`).join("\n\n");

  const systemPrompt = `You are an impartial moderator of a debate about: "${topic}".
Read the full debate and:
1. Briefly summarize each side's main argument (1-2 sentences per side)
2. Declare a winner (Agent A or Agent B) based on the strength of their arguments
3. Explain why in 2-3 sentences
Respond in English, clearly structured.`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: transcript }
      ],
      stream: false,
      options: { temperature: 0.3 }
    })
  });

  const data = await response.json();
  return data.message.content.trim();
}