import React, { useState, useEffect, useRef } from 'react'
import '../styles/authenticate.css'
import Login from '../components/Login'
import Register from '../components/Register'
import { useNavigate } from 'react-router-dom'

const Authenticate = () => {
  const [authType, setAuthType] = useState('login')
  const canvasRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const nodes = []
    const nodeCount = 50
    const symbols = ['⊕','⊗','∆','⊂','⊃','∑','√','λ'] // DSA/math symbols

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
      })
    }

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      nodes.forEach(node => {
        // Move node slightly towards cursor
        node.x += node.dx + (mouse.x - node.x) * 0.0005
        node.y += node.dy + (mouse.y - node.y) * 0.0005

        // Wrap around edges
        if (node.x > canvas.width) node.x = 0
        if (node.x < 0) node.x = canvas.width
        if (node.y > canvas.height) node.y = 0
        if (node.y < 0) node.y = canvas.height

        // Draw glowing symbol
        ctx.font = `${node.size}px 'Courier New', monospace`
        ctx.fillStyle = '#00c8ff'
        ctx.shadowColor = '#00c8ff'
        ctx.shadowBlur = 15
        ctx.fillText(node.symbol, node.x, node.y)
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="AuthenticatePage">
      <canvas ref={canvasRef} className="backgroundCanvas" />

      <div className="auth-navbar">
        <h3 onClick={() => navigate('/')}>SB Works</h3>
        <p onClick={() => navigate('/')}>Home</p>
      </div>

      {authType === 'login' ? (
        <Login setAuthType={setAuthType} />
      ) : (
        <Register setAuthType={setAuthType} />
      )}
    </div>
  )
}

export default Authenticate
