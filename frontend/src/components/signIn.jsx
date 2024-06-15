import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [flashMessage, setFlashMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { user, token } = await response.json();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user)); 
        console.log('Login successful!');
        console.log('User:', user);
        console.log('Token:', token);
        setFlashMessage('Login successful!');
        setTimeout(() => {
          navigate('/home');
        }, 1000);
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message);
        setFlashMessage('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setFlashMessage('Login failed. Please try again.');
    }
  };

  return (
    <div className="wrapper signIn">
      <div className="illustration">
        {/* <img src="https://source.unsplash.com/random" alt="illustration" /> */}
      </div>
      <div className="form">
        <div className="heading">LOGIN</div>
        {flashMessage && (
          <div className={`flash-message ${flashMessage.includes('successful') ? 'success' : 'error'}`}>
            {flashMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        <p>
          Don't have an account ? <Link to="/signup"> Sign Up </Link>
        </p>
      </div>
    </div>
  );
}
