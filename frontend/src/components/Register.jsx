import { useState } from 'react';
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai';
import { FaRegEnvelope } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import { PiUserCircleFill } from "react-icons/pi";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDOB] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post("http://localhost:4000/api/register", { username, email, password, dob },
      { withCredentials: true, headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      } });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh', background: 'linear-gradient(to bottom, #182B3A, #20A4F3)' }}>
      <div className="card mx-auto mt-4">
        <div className="card-title-container">
          <h5 className="card-title text-center my-3">SIGN UP</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleRegister} className='d-flex flex-column mt-5 mx-5' style={{color: "#87CEEB", fontWeight: "500"}}>
            <PiUserCircleFill size={150} className='mx-auto mb-2 mt-3' />
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <div className="input-group">
                <span className="input-group-text" style={{backgroundColor: "#AFCCE1"}}><AiOutlineUser /></span>
                <input type="text" className="form-control" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ backgroundColor: '#AFCCE1', color: '#13274F', fontWeight: "500" }} />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text" style={{backgroundColor: "#AFCCE1"}}><FaRegEnvelope /></span>
                <input type="email" className="form-control" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ backgroundColor: '#AFCCE1', color: '#13274F', fontWeight: "500" }} />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text" style={{backgroundColor: "#AFCCE1"}}><AiOutlineLock /></span>
                <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ backgroundColor: '#AFCCE1', color: '#13274F', fontWeight: "500" }} />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="dob" className="form-label">Date of Birth</label>
              <div className="input-group">
                <span className='input-group-text' style={{backgroundColor: "#AFCCE1"}}><BsCalendarDate /></span>
                <input type="date" className="form-control" id="dob" value={dob} onChange={(e) => setDOB(e.target.value)} style={{ backgroundColor: '#AFCCE1', fontWeight: "500" }} />
              </div>
            </div>
            <div className="mb-3 d-flex justify-space-between form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
            </div>
            <button type="submit" className='btn my-2' style={{backgroundColor: "#00FFFF", color: "#367588", fontWeight: "700"}}>
              SIGNUP
            </button>
            <p className='mx-auto' style={{textDecoration: "none", color: "#87CEEB", cursor: "pointer"}} onClick={() => navigate('/login')}>Already a user? Login now!</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;