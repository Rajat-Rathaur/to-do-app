import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [flashMessage, setFlashMessage] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

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
            const response = await fetch('http://localhost:5000/users/signup', {
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
                console.log('Signup successful!');
                console.log('User:', user);
                console.log('Token:', token);
                setFlashMessage("Signup successful!");
                navigate('/');
            } else {
                const errorData = await response.json();
                console.error('Signup failed:', errorData.message);
                setFlashMessage("Signup failed. Please try again.");
                navigate('/signup');
            }
        } catch (error) {
            console.error('Signup failed:', error);
            setFlashMessage("Signup failed. Please try again.");
            navigate('/signup');
        }
    };

    return (
        <div className="signUp">
            <div className="wrapper">
                <div className="illustration">{/* <img src="https://source.unsplash.com/random" alt="illustration" /> */}</div>
                <div className="form">
                    <div className="heading">CREATE AN ACCOUNT</div>
                    <form onSubmit={handleSubmit} className="w-full">
                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email">E-Mail</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your mail"
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
                        <h2 align="center" className="or">
                            OR
                        </h2>
                    </form>
                    <p>
                        Have an account ? <Link to="/"> Login </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
