import React from "react";
import "./styles.css";
import Login from "./components/signIn";
import Signup from "./components/signUp";
import Error from "./components/error";
import Home from "./pages/Home";
import Profile from "./pages/profile";
import {BrowserRouter as Router,Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
function App() {
  return (
    <div className="App">
        <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Error />} />
        <Route
            path="/home"
            element={<ProtectedRoute element={<Home />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
