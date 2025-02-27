import axios from "axios";
import { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../Context/AuthContext'
import './Login.css'
import React from 'react';

const Login = () => {

  const [credentials,setCredentials] = useState({
    username: undefined,
    password: undefined
  })
  const {loading, error, dispatch} = useContext(AuthContext)
    
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/")
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className="login">
        <div className="lContainer">
          <h1 className="heading">Ascenda Login</h1>
            <input type="text" placeholder='username' id="username" onChange={handleChange} className="lInput" />
            <input type="text" placeholder='password' id="password" onChange={handleChange} className="lInput" />
            <button disabled={loading} onClick={handleClick} className="lBtn" data-testid='Submit'>Login</button>
            {error && <span className="error">{error.message}</span>}
        </div>
    </div>
  )
}

export default Login
