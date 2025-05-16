import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './AuthContext'; 


const SignIn = () => {
  const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const { login } = useAuth(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { username, password };

        try {
            const response = await fetch('http://127.0.0.1:8000/signin/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (!response.ok) {
                setError(result.detail || 'Login failed.');
            } else {
                console.log('Login successful:', result);
               
                if (result && result.token) { 
                  localStorage.setItem('authToken', result.token);
                  console.log('Token stored:', result.token);
              } else {
                  console.error('No token received in sign-in response!', result);
                  setError('No token received from server.');
              }
              login(result.token);  
              setShowToast(true);
              setTimeout(() => {
                  navigate('/');
              }, 2000);
            }
        } catch (err) {
            setError(err.message || 'Login error');


            
        }
    };


  return (
    <div className="container mt-5 position-relative">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4 text-center">Sign In</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Sign In</button>
          </form>
        </div>
      </div>

    
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={2000} autohide>
          <Toast.Header>
            <strong className="me-auto">Welcome</strong>
            <small>Now</small>
          </Toast.Header>
          <Toast.Body>Login successful! Redirecting to home...</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default SignIn;
