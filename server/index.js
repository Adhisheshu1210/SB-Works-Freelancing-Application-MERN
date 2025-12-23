import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { Application, Chat, Freelancer, Project, User } from './Schema.js';
import { Server } from 'socket.io';
import http from 'http';
import SocketHandler from './SocketHandler.js';

const app = express();
const PORT = process.env.PORT || 6001;

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// ==================== SERVER & SOCKET ====================
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);
  SocketHandler(socket);
});

// ==================== DATABASE ====================
mongoose.connect('mongodb://localhost:27017/Freelancing', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ DB Connection Error:", err));

// ==================== AUTH ROUTES ====================
app.post('/register', async (req, res) => {
  try {
    const { username, email, password, usertype } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: passwordHash, usertype });
    const user = await newUser.save();

    if (usertype === 'freelancer') {
      const newFreelancer = new Freelancer({ userId: user._id });
      await newFreelancer.save();
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== FREELANCER ROUTES ====================
app.get('/fetch-freelancer/:id', async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ userId: req.params.id });
    res.status(200).json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/update-freelancer', async (req, res) => {
  try {
    const { freelancerId, updateSkills, description } = req.body;
    const freelancer = await Freelancer.findById(freelancerId);
    freelancer.skills = updateSkills.split(',');
    freelancer.description = description;
    await freelancer.save();
    res.status(200).json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== PROJECT ROUTES ====================
app.get('/fetch-project/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/fetch-projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/new-project', async (req, res) => {
  try {
    const { title, description, budget, skills, clientId, clientName, clientEmail } = req.body;
    const newProject = new Project({
      title,
      description,
      budget,
      skills: skills.split(','),
      clientId,
      clientName,
      clientEmail,
      postedDate: new Date()
    });
    await newProject.save();
    res.status(200).json({ message: "Project added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== APPLICATION ROUTES ====================
app.post('/make-bid', async (req, res) => {
  try {
    const { clientId, freelancerId, projectId, proposal, bidAmount, estimatedTime } = req.body;

    const freelancer = await User.findById(freelancerId);
    const freelancerData = await Freelancer.findOne({ userId: freelancerId });
    const project = await Project.findById(projectId);
    const client = await User.findById(clientId);

    const newApplication = new Application({
      projectId,
      clientId,
      clientName: client.username,
      clientEmail: client.email,
      freelancerId,
      freelancerName: freelancer.username,
      freelancerEmail: freelancer.email,
      freelancerSkills: freelancerData.skills,
      title: project.title,
      description: project.description,
      budget: project.budget,
      requiredSkills: project.skills,
      proposal,
      bidAmount,
      estimatedTime
    });

    const application = await newApplication.save();
    project.bids.push(freelancerId);
    project.bidAmounts.push(parseInt(bidAmount));
    freelancerData.applications.push(application._id);

    await project.save();
    await freelancerData.save();

    res.status(200).json({ message: "Bidding successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/fetch-applications', async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== APPROVE/REJECT APPLICATION ====================
app.get('/approve-application/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    const project = await Project.findById(application.projectId);
    const freelancer = await Freelancer.findOne({ userId: application.freelancerId });
    const user = await User.findById(application.freelancerId);

    application.status = 'Accepted';
    await application.save();

    const pendingApps = await Application.find({ projectId: application.projectId, status: "Pending" });
    for (const app of pendingApps) {
      app.status = 'Rejected';
      await app.save();
    }

    project.freelancerId = freelancer.userId;
    project.freelancerName = user.username;
    project.budget = application.bidAmount;
    project.status = "Assigned";

    freelancer.currentProjects.push(project._id);
    await project.save();
    await freelancer.save();

    res.status(200).json({ message: "Application approved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/reject-application/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    application.status = 'Rejected';
    await application.save();
    res.status(200).json({ message: "Application rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== PROJECT SUBMISSION ====================
app.post('/submit-project', async (req, res) => {
  try {
    const { projectId, projectLink, manualLink, submissionDescription } = req.body;
    const project = await Project.findById(projectId);

    project.projectLink = projectLink;
    project.manualLink = manualLink;
    project.submissionDescription = submissionDescription;
    project.submission = true;

    await project.save();
    res.status(200).json({ message: "Project submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/approve-submission/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const freelancer = await Freelancer.findOne({ userId: project.freelancerId });

    project.submissionAccepted = true;
    project.status = "Completed";

    freelancer.currentProjects = freelancer.currentProjects.filter(id => id.toString() !== project._id.toString());
    freelancer.completedProjects.push(project._id);
    freelancer.funds += parseInt(project.budget);

    await project.save();
    await freelancer.save();
    res.status(200).json({ message: "Submission approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/reject-submission/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    project.submission = false;
    project.projectLink = "";
    project.manualLink = "";
    project.submissionDescription = "";
    await project.save();
    res.status(200).json({ message: "Submission rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== USERS & CHAT ====================
app.get('/fetch-users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/fetch-chats/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== START SERVER ====================
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
