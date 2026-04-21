### 🌐 SB Works – Freelancing Application (MERN Stack)

SB Works is a full-stack Freelancing Web Application built using the MERN stack
(MongoDB, Express.js, React.js, Node.js).

The platform connects Clients and Freelancers, enabling clients to post projects and freelancers to bid, communicate, and complete work efficiently.

# 🔗 GitHub Repository

👉 GitHub: https://github.com/Adhisheshu1210/
👉 Youtube link: https://youtu.be/TccmwzWjkss
👉 Live link:  https://sb-work-freelancing.vercel.app/

## 🚀 Key Features
👤 User Authentication

Secure user registration and login

Role-based access (Client / Freelancer)

Password encryption using bcrypt

Session handling using local storage

# 🧑‍💼 Client Module

Post new freelance projects

View freelancer applications

Accept or reject proposals

# Track project lifecycle:

Available

Assigned

Completed

Chat with assigned freelancer (real-time)

## 🧑‍🎨 Freelancer Module

Browse all available projects

Apply for projects with:

Bid amount

Proposal

Estimated time

View applied projects and their status

Submit completed project with links and description

Chat with client (real-time)

## 💬 Real-Time Communication

Live chat between client and freelancer

Powered by Socket.IO

Project-specific chat rooms

## 🌐 General Features

Modern, responsive UI

Animated and glowing UI effects

RESTful API architecture

Persistent data storage using MongoDB

Clean and modular code structure

## 🛠️ Tech Stack
Frontend

React.js

JavaScript (ES6+)

HTML5

CSS3

Axios

React Router DOM

Backend

Node.js

Express.js

Socket.IO

bcrypt

CORS

Database

MongoDB (Community Server)

Mongoose ODM

Development Tools

Visual Studio Code

MongoDB Compass

Git & GitHub

Postman (API Testing)

npm (Node Package Manager)

## 📂 Project Structure
SB-Works-Freelancing-Application-MERN
│
├── client/                      # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── styles/
│       ├── App.js
│       └── index.js
│
├── server/                      # Node.js Backend
│   ├── Schema.js                # MongoDB Schemas
│   ├── SocketHandler.js         # Socket.IO logic
│   └── index.js                 # Server entry point
│
├── screenshots/                 # Application screenshots
│
└── README.md

## 🖼️ Application Screenshots

Screenshots are available in the screenshots/ folder, including:

Landing Page

Login Page

Registration Page

Client Dashboard

Post New Project Page

Client Applications Page

Freelancer Dashboard

All Projects Page

My Projects Page

Freelancer Applications Page

Real-Time Chat Interface

## ⚙️ Installation & Execution
# 1️⃣ Clone the Repository
git clone https://github.com/Adhisheshu1210/SB-Works-Freelancing-Application-MERN.git
cd SB-Works-Freelancing-Application-MERN

# 2️⃣ Backend Setup
cd server
npm install
node index.js


Backend Server runs on:

http://localhost:6001

# 3️⃣ Frontend Setup

Open a new terminal:

cd client
npm install
npm start


Frontend runs on:

http://localhost:3000

# 4️⃣ Start MongoDB

Ensure MongoDB is running locally:

mongod


Or start MongoDB using MongoDB Compass.

## 🔌 API & Socket Overview

REST APIs for authentication, projects, bids, and submissions

Socket.IO used for:

Joining project chat rooms

Sending and receiving real-time messages

Each project has an isolated chat room

## 📌 Notes

❌ Admin role is not implemented

✅ Only Client and Freelancer roles are supported

## 📚 Designed for:

Academic projects

Learning MERN stack

Portfolio demonstrations

⚠️ Not intended for production use without further security enhancements

## 🔮 Future Enhancements

Admin dashboard

Payment gateway integration

Project milestones

File uploads

Notifications system

Deployment on cloud (AWS / Render / Vercel)

### 📸 Application Screenshots
# 🌐 Landing Page
<p align="center"> <img src="screenshots/landing%20page.png" width="520" /> </p>

# 🔐 Authentication Pages
<p align="center"> <img src="screenshots/login%20page.png" width="260" /> <img src="screenshots/register%20page.png" width="260" /> </p>

# 🛠️ Admin Panel
<p align="center"> <img src="screenshots/admin%20dashboard.png" width="260" /> <img src="screenshots/admin%20all%20users%20page.png" width="260" /> <img src="screenshots/admin%20all%20project%20page.png" width="260" /> </p> <p align="center"> <img src="screenshots/admin%20all%20application%20page.png" width="260" /> </p>

# 👤 Client Panel
<p align="center"> <img src="screenshots/client%20dashboard%20page.png" width="260" /> <img src="screenshots/client%20project%20page.png" width="260" /> <img src="screenshots/client%20new%20project%20page.png" width="260" /> </p> <p align="center"> <img src="screenshots/client%20application%20page.png" width="260" /> </p>

# 🧑‍💻 Freelancer Panel
<p align="center"> <img src="screenshots/freelancer%20dashboard.png" width="260" /> <img src="screenshots/freelancer%20all%20projects%20page.png" width="260" /> <img src="screenshots/freelancer%20my%20project%20page.png" width="260" /> </p> <p align="center"> <img src="screenshots/freelancer%20application%20page.png" width="260" /> <img src="screenshots/freelancer%20project%20communication%20page.png" width="260" /> </p>

### 👨‍💻 Developed By

  Angothu Adhisheshu

🎓 MERN Stack Developer
🔗 GitHub: https://github.com/Adhisheshu1210/SB-Works-Freelancing-Application-MERN

"# SB-Works-Freelancing-Application-MERN" 
