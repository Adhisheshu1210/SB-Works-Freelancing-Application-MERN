import React, { useEffect, useState } from 'react'
import '../../styles/freelancer/freelancer.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Freelancer = () => {

  const navigate = useNavigate()

  const [isDataUpdateOpen, setIsDataUpdateOpen] = useState(false)
  const [freelancerData, setFreelancerData] = useState(null)

  const [skills, setSkills] = useState([])
  const [description, setDescription] = useState('')

  const [freelancerId, setFreelancerId] = useState('')
  const [updateSkills, setUpdateSkills] = useState('')
  const [updateDescription, setUpdateDescription] = useState('')

  const [applicationsCount, setApplicationsCount] = useState([])

  /* ---------------- Fetch Freelancer ---------------- */
  useEffect(() => {
    const id = localStorage.getItem('userId')
    if (id) fetchUserData(id)
    fetchApplications()
  }, [])

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-freelancer/${id}`)
      if (response.data) {
        setFreelancerData(response.data)
        setFreelancerId(response.data._id)
        setSkills(response.data.skills || [])
        setDescription(response.data.description || '')
        setUpdateSkills((response.data.skills || []).join(', '))
        setUpdateDescription(response.data.description || '')
      }
    } catch (err) {
      console.error(err)
    }
  }

  /* ---------------- Update Freelancer ---------------- */
  const updateUserData = async () => {
    if (!updateSkills || !updateDescription) {
      alert("All fields are required")
      return
    }

    try {
      await axios.post(`http://localhost:6001/update-freelancer`, {
        freelancerId,
        updateSkills,
        description: updateDescription
      })
      alert("Profile updated successfully")
      setIsDataUpdateOpen(false)
      fetchUserData(freelancerId)
    } catch (err) {
      console.error(err)
    }
  }

  /* ---------------- Fetch Applications ---------------- */
  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:6001/fetch-applications")
      setApplicationsCount(
        response.data.filter(app => app.freelancerId === localStorage.getItem('userId'))
      )
    } catch (err) {
      console.error(err)
    }
  }

  if (!freelancerData) return null

  return (
    <>
      {/* DIGITAL MOVING BACKGROUND */}
      <div className="background-dots">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDuration: `${Math.random() * 6 + 6}s`
            }}
          />
        ))}
      </div>

      <div className="freelancer-home">

        {/* DASHBOARD CARDS */}
        <div className="home-cards">

          <div className="home-card">
            <h4>Current Projects</h4>
            <p>{freelancerData.currentProjects.length}</p>
            <button onClick={() => navigate('/my-projects')}>View Projects</button>
          </div>

          <div className="home-card">
            <h4>Completed Projects</h4>
            <p>{freelancerData.completedProjects.length}</p>
            <button onClick={() => navigate('/my-projects')}>View Projects</button>
          </div>

          <div className="home-card">
            <h4>Applications</h4>
            <p>{applicationsCount.length}</p>
            <button onClick={() => navigate('/myApplications')}>View Applications</button>
          </div>

          <div className="home-card">
            <h4>Funds</h4>
            <p>₹ {freelancerData.funds}</p>
          </div>

        </div>

        {/* PROFILE DETAILS */}
        <div className="freelancer-details">

          {!isDataUpdateOpen ? (

            <div className="freelancer-details-data">

              <span>
                <h4>My Skills</h4>
                <div className="skills">
                  {skills.length > 0 ? (
                    skills.map(skill => (
                      <span className="skill" key={skill}>{skill}</span>
                    ))
                  ) : (
                    <p>No skills added</p>
                  )}
                </div>
              </span>

              <span>
                <h4>Description</h4>
                <p>{description || 'Please add your description'}</p>
              </span>

              <button
                className="btn btn-outline-success"
                onClick={() => setIsDataUpdateOpen(true)}
              >
                Update Profile
              </button>

            </div>

          ) : (

            <div className="freelancer-details-update">

              <span>
                <h4>My Skills</h4>
                <input
                  type="text"
                  className="form-control"
                  placeholder="React, Node, MongoDB"
                  value={updateSkills}
                  onChange={(e) => setUpdateSkills(e.target.value)}
                />
              </span>

              <span>
                <h4>Description</h4>
                <textarea
                  className="form-control"
                  placeholder="Tell something about yourself..."
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                />
              </span>

              <button
                className="btn btn-outline-success mt-3"
                onClick={updateUserData}
              >
                Save Changes
              </button>

            </div>

          )}

        </div>
      </div>
    </>
  )
}

export default Freelancer
