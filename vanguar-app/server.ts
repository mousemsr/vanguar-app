import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check API
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'VANGUAR Barbería Medellín' });
});

// Gemini Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'El mensaje es requerido.' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(500).json({
        error: 'No se ha configurado la API Key de Gemini en los secretos del servidor.',
      });
    }

    const systemInstruction = `Eres "El Parcero AI", el asistente inteligente y barbero virtual de VANGUAR Barbería en Medellín, Colombia. 
Hablas con la jerga y actitud característica de Medellín, muy paisa, cercana, respetuosa, alegre y bacana (usando expresiones como "¡Qué más pues, parce!", "melo", "firme", "bacano", "neita", "parcero", "el duro", "de una", "agéndate el patico").

Tu objetivo es asesorar a los clientes en:
1. Elección de cortes de cabello según su tipo de rostro o estilo (Fade, Mullet moderno, Buzz cut, Taper fade, Corte clásico, Texturizado).
2. Cuidado de la barba, aceites, perfilado e higiene.
3. Información sobre VANGUAR: Ubicados en El Poblado (Calle 10 # 41-28) y Laureles (Nutibara # 72-15) en Medellín.
4. Precios aproximados (Corte Melo $35.000 COP, Barba de Patrón $25.000 COP, Combo Rey Paisa $55.000 COP, Tintura/Platinado $90.000 COP).
5. Invitar siempre al usuario a usar el botón de "Agendar Cita" dentro de la aplicación para separar su cupo con su barbero favorito (Camilo "El Duro", Mateo "El Parcero", Santi "El Máster" o Sebas "El Pro").

Responde de manera concisa, entusiasta y muy paisa.`;

    // Construct conversation messages
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      history.forEach((msg: { sender: 'user' | 'bot'; text: string }) => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const text = response.text || '¡Ey parce! Ocurrió un pequeño imprevisto con el sistema, pero decime en qué más te puedo colaborar.';

    return res.json({ reply: text });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'Hubo un error procesando tu consulta con el parcero AI.',
      details: error?.message || 'Error desconocido',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`💈 VANGUAR Barbería server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
