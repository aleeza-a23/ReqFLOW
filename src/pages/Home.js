import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { globalBackground, buttonStyle } from "../styles/globalStyles";

function Home() {
  return (
    <div style={globalBackground}>
      <Navbar />

      <div
        style={{
          textAlign: "center",
          paddingTop: "120px",
          paddingBottom: "120px",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
        className="fade-in"
      >
        <h1
          style={{
            fontSize: "70px",
            color: "white",
            marginBottom: "20px",
            background: "linear-gradient(135deg, #ffffff, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Intelligent Requirement Classification
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "22px",
            maxWidth: "900px",
            margin: "auto",
            lineHeight: 1.8,
          }}
        >
          Classify Functional and Non-Functional requirements using Machine Learning and Nature Language Processing.
        </p>

        <Link to="/classifier">
          <button
            style={{
              ...buttonStyle,
              marginTop: "40px",
              padding: "18px 48px",
              fontSize: "18px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(99, 102, 241, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
             Try Classifier
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;