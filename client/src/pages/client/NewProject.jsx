import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/client/newProject.css';

const NewProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [skills, setSkills] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !description || !budget || !skills) {
      setError('All fields are required!');
      return;
    }

    setError('');
    try {
      await axios.post("http://localhost:6001/new-project", {
        title,
        description,
        budget,
        skills,
        clientId: localStorage.getItem('userId'),
        clientName: localStorage.getItem('username'),
        clientEmail: localStorage.getItem('email')
      });
      alert("New project added!");
      setTitle('');
      setDescription('');
      setBudget('');
      setSkills('');
      navigate('/client');
    } catch (err) {
      alert("Operation failed!");
    }
  };

  return (
    <div className="new-project-page">
      <h3>Post New Project</h3>

      <div className="new-project-form">

        {error && <p className="error-msg">{error}</p>}

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Project title</label>
        </div>

        <div className="form-floating mb-3">
          <textarea
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>Description</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <label>Budget (in &#8377;)</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Required skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <label>Required skills (comma separated)</label>
        </div>

        <button className="btn" onClick={handleSubmit}>Submit</button>

      </div>
    </div>
  );
};

export default NewProject;
