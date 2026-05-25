import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const MONGODB_URI = process.env.MONGODB_URI!;

// Middlewares
app.use(cors());
app.use(express.json());

// Connection to the DB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('🍃 Connected successfully to MongoDB Atlas!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Project Schema
const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true },
);
const ProjectModel = mongoose.model('Project', ProjectSchema);

// Middleware to verify JWT token
function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

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

// Route 1: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend portfolio is online' });
});

// Route 2: Admin login
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// Route 3: Save new project (protected)
app.post('/api/projects', verifyToken, async (req, res) => {
  try {
    const { title, description, url } = req.body;
    if (!title || !description || !url) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const newProject = new ProjectModel({ title, description, url });
    const savedProject = await newProject.save();
    console.log('Project saved in MongoDB:', savedProject);
    res
      .status(201)
      .json({ message: 'Project saved permanently', data: savedProject });
  } catch (error) {
    console.error('Database insertion error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 4: Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await ProjectModel.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 5: Delete a project (protected)
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

// Route 6: Update a project (protected)
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
    console.error('Update error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
