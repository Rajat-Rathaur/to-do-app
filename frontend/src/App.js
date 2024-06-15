import React from "react";
import "./styles.css";
import Login from "./components/signIn";
import Signup from "./components/signUp";
import Error from "./components/error";
import Home from "./pages/Home";
import Profile from "./pages/profile";
import {BrowserRouter as Router,Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Error />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
