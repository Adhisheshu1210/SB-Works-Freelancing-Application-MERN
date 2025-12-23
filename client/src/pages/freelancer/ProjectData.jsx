import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/freelancer/ProjectData.css';
import { GeneralContext } from '../../context/GeneralContext';

const ProjectData = () => {

  const { socket } = useContext(GeneralContext);
  const { id } = useParams();

  /* ================= STATES ================= */
  const [project, setProject] = useState(null);
  const [chats, setChats] = useState(null);

  const [clientId, setClientId] = useState('');
  const [freelancerId] = useState(localStorage.getItem('userId'));
  const [projectId, setProjectId] = useState(id);

  // Bid form
  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  // Submission
  const [projectLink, setProjectLink] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');

  // Chat
  const [message, setMessage] = useState('');

  /* ================= EFFECTS ================= */

  useEffect(() => {
    fetchProject();
    fetchChats();
    joinSocketRoom();

    socket?.on("message-from-user", fetchChats);

    return () => {
      socket?.off("message-from-user");
    };
  }, []);

  /* ================= FUNCTIONS ================= */

  const joinSocketRoom = () => {
    socket?.emit("join-chat-room", {
      projectId: id,
      freelancerId
    });
  };

  const fetchProject = async () => {
    try {
      const res = await axios.get(`http://localhost:6001/fetch-project/${id}`);
      setProject(res.data);
      setProjectId(res.data._id);
      setClientId(res.data.clientId);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await axios.get(`http://localhost:6001/fetch-chats/${id}`);
      setChats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= VALIDATED ACTIONS ================= */

  const handleBidding = async () => {
    if (!bidAmount || !estimatedTime || !proposal.trim()) {
      alert("All bid fields are required!");
      return;
    }

    try {
      await axios.post("http://localhost:6001/make-bid", {
        clientId,
        freelancerId,
        projectId,
        proposal,
        bidAmount,
        estimatedTime
      });

      setProposal('');
      setBidAmount('');
      setEstimatedTime('');
      alert("Bid placed successfully!");
    } catch {
      alert("Bidding failed!");
    }
  };

  const handleProjectSubmission = async () => {
    if (!projectLink.trim() || !manualLink.trim() || !submissionDescription.trim()) {
      alert("All submission fields are required!");
      return;
    }

    try {
      await axios.post("http://localhost:6001/submit-project", {
        clientId,
        freelancerId,
        projectId,
        projectLink,
        manualLink,
        submissionDescription
      });

      setProjectLink('');
      setManualLink('');
      setSubmissionDescription('');
      alert("Project submitted successfully!");
    } catch {
      alert("Submission failed!");
    }
  };

  const handleMessageSend = () => {
    if (!message.trim()) return;

    socket.emit("new-message", {
      projectId,
      senderId: freelancerId,
      message,
      time: new Date()
    });

    setMessage('');
    fetchChats();
  };

  /* ================= UI ================= */

  if (!project) return null;

  return (
    <div className="project-data-page">

      {/* ================= LEFT SIDE ================= */}
      <div className="project-data-container">

        <div className="project-data">
          <h3>{project.title}</h3>
          <p>{project.description}</p>

          <h5>Required Skills</h5>
          <div className="required-skills">
            {project.skills.map(skill => (
              <p key={skill}>{skill}</p>
            ))}
          </div>

          <h6>Budget: ₹ {project.budget}</h6>
        </div>

        {/* ===== BID FORM ===== */}
        {project.status === "Available" && (
          <div className="project-form-body">
            <h4>Send Proposal</h4>

            <input
              type="number"
              placeholder="Bid Amount"
              value={bidAmount}
              required
              onChange={(e) => setBidAmount(e.target.value)}
            />

            <input
              type="number"
              placeholder="Estimated Time (days)"
              value={estimatedTime}
              required
              onChange={(e) => setEstimatedTime(e.target.value)}
            />

            <textarea
              placeholder="Describe your proposal"
              value={proposal}
              required
              onChange={(e) => setProposal(e.target.value)}
            />

            <button
              className="btn btn-success"
              disabled={project.bids.includes(freelancerId)}
              onClick={handleBidding}
            >
              {project.bids.includes(freelancerId) ? "Already Bidded" : "Post Bid"}
            </button>
          </div>
        )}

        {/* ===== SUBMISSION ===== */}
        {project.freelancerId === freelancerId && (
          <div className="project-form-body">
            <h4>Submit Project</h4>

            {project.submissionAccepted ? (
              <p>✅ Project Completed</p>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Project Link"
                  value={projectLink}
                  required
                  onChange={(e) => setProjectLink(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Manual Link"
                  value={manualLink}
                  required
                  onChange={(e) => setManualLink(e.target.value)}
                />

                <textarea
                  placeholder="Describe your work"
                  value={submissionDescription}
                  required
                  onChange={(e) => setSubmissionDescription(e.target.value)}
                />

                <button
                  className="btn btn-success"
                  disabled={project.submission}
                  onClick={handleProjectSubmission}
                >
                  {project.submission ? "Already Submitted" : "Submit Project"}
                </button>
              </>
            )}
          </div>
        )}

      </div>

      {/* ================= CHAT ================= */}
      <div className="project-chat-container">
        <h4>Chat with Client</h4>
        <hr />

        {project.freelancerId === freelancerId ? (
          <>
            <div className="chat-messages">
              {chats?.messages.map(msg => (
                <div
                  key={msg.id}
                  className={msg.senderId === freelancerId ? "my-message" : "received-message"}
                >
                  <div>
                    <p>{msg.text}</p>
                    <h6>{new Date(msg.time).toLocaleString()}</h6>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button disabled={!message.trim()} onClick={handleMessageSend}>
                Send
              </button>
            </div>
          </>
        ) : (
          <i style={{ color: '#999' }}>
            Chat enabled after project assignment
          </i>
        )}
      </div>

    </div>
  );
};

export default ProjectData;
