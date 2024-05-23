import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./components/Home";


function App() {

  let isLoggedIn = localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/login" element = {<Login />} />
      <Route path="/register" element={<Register />}/>

      {/* Protected */}

      <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login"/>}/>
    </Routes>
  )
}

export default App
