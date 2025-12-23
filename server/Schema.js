import mongoose from "mongoose";

/* =======================
   USER SCHEMA
======================= */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  usertype: {
    type: String,
    required: true
  }
}, { timestamps: true });

/* =======================
   FREELANCER SCHEMA
======================= */
const freelancerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  skills: { type: [String], default: [] },
  description: { type: String, default: "" },
  currentProjects: { type: [String], default: [] }, // projectIds
  completedProjects: { type: [String], default: [] },
  applications: { type: [String], default: [] }, // applicationIds
  funds: { type: Number, default: 0 }
}, { timestamps: true });

/* =======================
   PROJECT SCHEMA
======================= */
const projectSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  clientName: String,
  clientEmail: String,
  title: String,
  description: String,
  budget: Number,
  skills: { type: [String], default: [] },
  bids: { type: [String], default: [] },       // freelancerIds
  bidAmounts: { type: [Number], default: [] },
  postedDate: String,
  status: { type: String, default: "Available" },
  freelancerId: String,
  freelancerName: String,
  deadline: String,
  submission: { type: Boolean, default: false },
  submissionAccepted: { type: Boolean, default: false },
  projectLink: { type: String, default: "" },
  manualLink: { type: String, default: "" },   // fixed typo
  submissionDescription: { type: String, default: "" }
}, { timestamps: true });

/* =======================
   APPLICATION SCHEMA
======================= */
const applicationSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  clientId: String,
  clientName: String,
  clientEmail: String,
  freelancerId: String,
  freelancerName: String,
  freelancerEmail: String,
  freelancerSkills: { type: [String], default: [] },
  title: String,
  description: String,
  budget: Number,
  requiredSkills: { type: [String], default: [] },
  proposal: String,
  bidAmount: Number,
  estimatedTime: Number,
  status: { type: String, default: "Pending" }
}, { timestamps: true });

/* =======================
   CHAT SCHEMA
======================= */
const chatSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // use projectId as _id
  messages: [
    {
      id: String,        // unique message id (UUID)
      senderId: String,
      text: String,
      time: String
    }
  ]
}, { timestamps: true });

/* =======================
   EXPORT MODELS
======================= */
export const User = mongoose.model("users", userSchema);
export const Freelancer = mongoose.model("freelancers", freelancerSchema);
export const Project = mongoose.model("projects", projectSchema);
export const Application = mongoose.model("applications", applicationSchema);
export const Chat = mongoose.model("chats", chatSchema);
