import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import 'bootstrap/dist/css/bootstrap.min.css';

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        const payload = { username: username, email: email, password1: password, password2: confirmPassword,};
        console.log("Sending payload:", JSON.stringify(payload));
        try {
            const response = await axios.post('http://127.0.0.1:8000/signup/', payload);
            if (response.status === 201) {
                setSuccessMessage(response.data.message);
                setShowToast(true);
                localStorage.setItem('authToken', response.data.token);
                setTimeout(() => {
                    window.location.reload(); 
                    navigate('/'); 
                }, 2500);
            } else {
                setError(JSON.stringify(response.data));
            }
        } catch (error) {
            setError('falid signUp');
            console.error('Signup error:', error);
        }
    };

    const hideToast = () => setShowToast(false);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Sign Up</h2>


                <ToastContainer position="top-end" className="p-3">
                        <Toast show={showToast} onClose={hideToast} bg="success">
                            <Toast.Header>
                                <strong className="me-auto text-white">Success!</strong>
                                <small className="text-white">Just now</small>
                            </Toast.Header>
                            <Toast.Body className="text-white">{successMessage || "User created successfully!"}</Toast.Body>
                        </Toast>
                    </ToastContainer>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username:</label>
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
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password:</label>
                            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;