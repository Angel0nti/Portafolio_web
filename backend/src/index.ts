import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const MONGODB_URI = process.env.MONGODB_URI!;

// Middlewares globales
app.use(cors());
app.use(express.json());

// =========================================================================
// CONEXIÓN MAESTRA OPTIMIZADA PARA PLATAFORMAS SERVERLESS (VERCEL)
// =========================================================================
let isConnected = false; // Variable en caché para rastrear el canal con MongoDB Atlas

const connectDB = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Si la conexión sigue activa en la memoria del contenedor, pasamos directo a la ruta
  if (isConnected && mongoose.connection.readyState === 1) {
    return next();
  }

  try {
    console.log(
      '[Mongo] Canal inactivo detectado. Levantando conexión fresca...',
    );

    const db = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Evita que Mongoose ponga peticiones en fila de espera infinita
      serverSelectionTimeoutMS: 5000, // Limita el tiempo de espera a 5s para evitar que Vercel cancele por Timeout
    });

    isConnected = db.connections[0].readyState === 1;
    console.log('¡Connected successfully to MongoDB Atlas!');
    next();
  } catch (err: any) {
    console.error('MongoDB connection error:', err.message);
    res
      .status(500)
      .json({ error: 'Database Connection Error', message: err.message });
  }
};

// Inyectamos el conector inteligente de base de datos de forma global para todas las rutas de la API
app.use(connectDB);

// Limitador de intentos para el inicio de sesión
const loginLimiter = rateLimit({
  windowMs: 16 * 60 * 1000, // 16 minutos
  max: 5,
  message: { error: 'Too many login attempts, please try again in 16 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Modelos y Esquemas (Se mantienen idénticos)
const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true },
);
// Evitamos la sobreescritura de modelos en caliente de Mongoose en Vercel
const ProjectModel =
  mongoose.models.Project || mongoose.model('Project', ProjectSchema);

const StrengthSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    definition: { type: String, required: true },
  },
  { timestamps: true },
);
const StrengthModel =
  mongoose.models.Strength || mongoose.model('Strength', StrengthSchema);

// Middleware para verificar token JWT
function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// -------------------------------------------------------------------------
// RUTAS DE LA API (Mantienen su lógica intacta y segura)
// -------------------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio is online' });
});

app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

app.post('/api/projects', verifyToken, async (req, res) => {
  try {
    const { title, description, url } = req.body;
    if (!title || !description || !url) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const newProject = new ProjectModel({ title, description, url });
    const savedProject = await newProject.save();
    res.status(201).json({ message: 'Project saved', data: savedProject });
  } catch (error) {
    console.error('Database insertion error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await ProjectModel.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/projects/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await ProjectModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/api/projects/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const updated = await ProjectModel.findByIdAndUpdate(
      id,
      { title, description, url },
      { new: true },
    );
    res
      .status(200)
      .json({ message: 'Project updated successfully', data: updated });
  } catch (error) {
    console.error('Project update error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/strengths', async (req, res) => {
  try {
    const strengths = await StrengthModel.find();
    res.status(200).json(strengths);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/strengths', verifyToken, async (req, res) => {
  try {
    const { title, definition } = req.body;
    if (!title || !definition) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const newStrength = new StrengthModel({ title, definition });
    const saved = await newStrength.save();
    res.status(201).json({ message: 'Strength saved', data: saved });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/api/strengths/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, definition } = req.body;
    const updated = await StrengthModel.findByIdAndUpdate(
      id,
      { title, definition },
      { new: true },
    );
    res.status(200).json({ message: 'Strength updated', data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/strengths/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await StrengthModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Strength deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Encendido del puerto condicional (Ajustado para no chocar con las Serverless de Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app; // Obligatorio para mapear las funciones serverless de Vercel
