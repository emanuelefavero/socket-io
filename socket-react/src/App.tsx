import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io()

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [showUserConnected, setShowUserConnected] = useState('')
  const [showUserDisconnected, setShowUserDisconnected] = useState('')
  const [lastPong, setLastPong] = useState<String | null>(null)

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('user-connected', message => {
      setShowUserConnected(message)

      setTimeout(() => {
        setShowUserConnected('')
      }, 2000)
    })

    socket.on('user-disconnected', message => {
      setShowUserDisconnected(message)

      setTimeout(() => {
        setShowUserDisconnected('')
      }, 2000)
    })

    socket.on('pong', () => {
      setLastPong(new Date().toISOString())
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('pong')
    }
  }, [])

  const sendPing = () => {
    socket.emit('ping')
  }

  return (
    <>
      <p>Connected: {'' + isConnected}</p>
      <h2>{showUserConnected}</h2>
      <h2>{showUserDisconnected}</h2>
      <p>Last pong: {lastPong || '-'}</p>
      <button onClick={sendPing}>Send ping</button>
    </>
  )
}

export default App
