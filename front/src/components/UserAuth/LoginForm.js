import React, { useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import { Link, useNavigate } from "react-router-dom";
import UserAuthCSS from "./userAuth.module.css";

const LoginForm = () => {
    const { setUsername, setUserId } = useContext(UserContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:4000/api/v1/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            console.log("Login successful:", data);
            setUsername(data.username);
            setUserId(data.userId);

            // Save token to localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);

            // Reset form fields
            setFormData({
                username: "",
                password: "",
            });

            navigate("/procedures");
        } catch (error) {
            console.error("Error during login:", error);
            // Handle error state
        }
    };

    return (
        <div className="container">
            <div className={UserAuthCSS.form}>
                <h2>Login Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
