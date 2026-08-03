import Groq from "groq-sdk"
import dotnev from "dotenv"

dotnev.config()

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!
})

export interface AiAnalysis {
    explanation: string,
    severity: 'low' | 'medium' | 'high',
    recommendation: string
}

export const analyzeThreat = async (
    threatType: string,
    rawLog: string,
    ipAddress: string
): Promise<AiAnalysis> => {
    const prompt = `
    You are a cybersecurity expert analyzing a security threat detected in server logs.

Threat Type: ${threatType}
IP Address: ${ipAddress}
Raw Log Entry: ${rawLog}

Respond in this exact JSON format with no extra text:
{
  "explanation": "A clear 2-3 sentence explanation of what this threat is and what the attacker was trying to do",
  "severity": "low" or "medium" or "high",
  "recommendation": "A specific 1-2 sentence recommendation to defend against this attack"
}
`

const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{role: 'user', content: prompt}],
    max_tokens: 300,
    temperature: 0.3
})

const content = response.choices[0].message.content || ''

try {
    const cleaned = content.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned) as AiAnalysis
    return parsed
} catch {
    return {
        explanation: content,
        severity: 'medium',
        recommendation: 'Review your server logs and consider blocking this IP address.'
        }
    }
}