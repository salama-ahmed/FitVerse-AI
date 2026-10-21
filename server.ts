import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!ai) {
      // Friendly fallback if key is not injected yet
      return res.json({
        reply: "Coach Apex here! To activate live AI chat coaching with Gemini, make sure your GEMINI_API_KEY is configured in the Secrets panel. In the meantime, remember: for squats, push your knees outward tracking your toes, brace your abdominal core, and drive through the heels; for boxing, keep your guard chin-tucked and snap your punches from hip rotation!"
      });
    }

    const systemInstruction = `You are Coach Apex, the lead biomechanics specialist and elite AI Fitness Trainer for FitVerse AI.
FitVerse AI provides 3D virtual exercise demonstrations (Squats, Boxing, Jumping Jacks) and real-time computer vision pose tracking with MediaPipe.
Your tone is energetic, knowledgeable, encouraging, and science-grounded.
Help the user optimize workout intensity, fix form flaws (e.g. knee valgus cave, lumbar rounding, dropping guard in boxing, breathing cadence), design training splits, and answer fitness nutrition questions.
Keep responses concise, motivating, and easy to read during a workout with bullet points where helpful.
User's current workout session stats: ${context ? JSON.stringify(context) : 'None provided'}`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Keep pushing your limits! What exercise would you like advice on next?';
    res.json({ reply });
  } catch (error: any) {
    console.error('FitVerse AI Chat error:', error);
    // Provide scientific biomechanics coaching fallback
    const fallbackTips = [
      "Keep your abdominal core braced and maintain neutral cervical-spine alignment throughout the movement.",
      "For squats: push your knees outward tracking your second toe, keep your chest proud, and drive aggressively through your mid-foot and heels.",
      "For boxing combinations: generate power from your rear foot pivot and hip rotation rather than pushing with your arms alone, and keep your non-striking fist guarding your cheek.",
      "For metabolic conditioning: maintain rhythmic nasal-inhalation and sharp diaphragmatic exhalation on each concentric exertion."
    ];
    const randomTip = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
    res.json({
      reply: `Coach Apex here: ${randomTip} Focus on deliberate, controlled tempo and full range of motion!`
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`FitVerse AI server running on http://localhost:${port}`);
  });
}

startServer();
