import React from "react";
import Navbar from "../components/Navbar";
import { globalBackground, cardStyle } from "../styles/globalStyles";

import {
  FaRobot,
  FaBolt,
  FaChartBar,
  FaBrain,
  FaLaptopCode,
  FaSearch,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaSearch />,
      title: "Intelligent Requirement Classification",
      desc: "Automatically classifies software requirements into Functional and Non-Functional categories.",
    },

    {
      icon: <FaBolt />,
      title: "Real-Time Prediction",
      desc: "Provides instant classification results with fast and efficient processing speed.",
    },

    {
      icon: <FaRobot />,
      title: "Machine Learning Powered",
      desc: "Uses the Naive Bayes Machine Learning algorithm for accurate requirement prediction.",
    },

    {
      icon: <FaBrain />,
      title: "Natural Language Processing",
      desc: "Performs text preprocessing, cleaning, and analysis for better prediction accuracy.",
    },

    {
      icon: <FaLaptopCode />,
      title: "Modern User Interface",
      desc: "Responsive and user-friendly React interface with smooth navigation and design.",
    },

    {
      icon: <FaChartBar />,
      title: "Accurate & Efficient Analysis",
      desc: "Reduces manual effort and improves consistency in software requirement engineering.",
    },
  ];

  return (
    <div style={globalBackground}>
      <Navbar />

      <div style={{ padding: "60px 40px" }} className="fade-in">
        <h1
          style={{
            textAlign: "center",
            marginBottom: "60px",
            fontSize: "50px",
            background: "linear-gradient(135deg, #ffffff, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Features
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                ...cardStyle,
                textAlign: "center",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(139, 92, 246, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "42px",
                  color: "#8b5cf6",
                  marginBottom: "20px",
                }}
              >
                {feature.icon}
              </div>

              <h3
                style={{
                  color: "#ffffff",
                  marginBottom: "12px",
                  fontSize: "22px",
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: "1.7",
                  fontSize: "15px",
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;