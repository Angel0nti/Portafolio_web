import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // This line actives cors
app.use(express.json()); // Allows the server understand data in JSON format

// Connection to the DB
mongoose
  .connect(
    'mongodb+srv://angel2:capitanGeneral19@cluster0.cagdpnr.mongodb.net/portfolio?retryWrites=true&w=majority',
  )
  .then(() => console.log('🍃 Connected successfully to MongoDB Atlas!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Create the squema (the blueprint for the projects)
const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt fields
);
// Create the model (the tool to make queries)
const ProjectModel = mongoose.model('Project', ProjectSchema);

// Route 1: Health test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend portfolio is online' });
});

// Route 2: Receive new projects from Angular (POST)
app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, url } = req.body;
    if (!title || !description || !url) {
      res.status(400).json({ error: 'Missing reuired fields' });
      return;
    }

    // Create a new document instance using our Moongose Model
    const newProject = new ProjectModel({ title, description, url });

    // Save the document into the actual database async
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

// Route 3: Get All Projects From MONGODB (GET)
app.get('/api/projects', async (req, res) => {
  try {
    // ProjectModel.find() queries MongoDB and returns All documents in the collection
    const projects = await ProjectModel.find();

    // Send the array of projects back to Angular with a 200 OK status
    res.status(200).json(projects);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Start up the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
