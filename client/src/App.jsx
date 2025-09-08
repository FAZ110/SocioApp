import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import NavBar from './components/Navbar'
import Feed from './components/Feed'
import Profile from './components/Profile'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar/>
          <Routes>
            <Route path="/" element={<h1>Welcome to SocioApp!</h1>} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

          </Routes>
          
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
