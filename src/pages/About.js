import React from "react";
import Navbar from "../components/Navbar";
import { globalBackground, cardStyle } from "../styles/globalStyles";

import {
  FaRobot,
  FaCheckCircle,
  FaCircle,
  FaChartLine,
  FaBrain,
  FaLaptopCode,
} from "react-icons/fa";

function About() {
  return (
    <div style={globalBackground}>
      <Navbar />

      <div
        style={{ padding: "60px 40px" }}
        className="fade-in"
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "52px",
            background:
              "linear-gradient(135deg, #ffffff, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          About ReqFLOW
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginBottom: "50px",
            fontSize: "18px",
          }}
        >
          Intelligent Software Requirement Classification
          System
        </p>

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <div style={cardStyle}>
            {/* INTRO */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "25px",
              }}
            >
              <FaRobot
                style={{
                  color: "#8b5cf6",
                  fontSize: "34px",
                }}
              />

              <h2
                style={{
                  margin: 0,
                  fontSize: "30px",
                }}
              >
                Project Overview
              </h2>
            </div>

            <p
              style={{
                color: "#cbd5e1",
                fontSize: "18px",
                lineHeight: 1.8,
                marginBottom: "20px",
              }}
            >
              ReqFLOW is an intelligent requirement
              classification platform developed using
              Machine Learning and Natural Language
              Processing techniques.
            </p>

            <p
              style={{
                color: "#cbd5e1",
                fontSize: "18px",
                lineHeight: 1.8,
                marginBottom: "25px",
              }}
            >
              The system helps software engineers,
              analysts, and students automatically
              classify software requirements into:
            </p>

            {}
            <div
              style={{
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "18px",
                }}
              >
                <FaCheckCircle
                  style={{
                    color: "#34d399",
                    fontSize: "22px",
                  }}
                />

                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "18px",
                  }}
                >
                  Functional Requirements
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <FaCircle
                  style={{
                    color: "#818cf8",
                    fontSize: "18px",
                  }}
                />

                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "18px",
                  }}
                >
                  Non-Functional Requirements
                </span>
              </div>
            </div>

            <p
              style={{
                color: "#cbd5e1",
                fontSize: "18px",
                lineHeight: 1.8,
                marginBottom: "35px",
              }}
            >
              ReqFLOW improves requirement analysis,
              reduces manual effort, and enhances
              software engineering workflows through
              automated prediction and probability
              analysis.
            </p>

            {/* STATS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px,1fr))",
                gap: "20px",
              }}
            >
              <div style={statsCard}>
                <FaChartLine style={statsIcon} />

                <div style={statsNumber}>81%</div>

                <div style={statsLabel}>
                  Test Accuracy
                </div>
              </div>

              <div style={statsCard}>
                <FaBrain style={statsIcon} />

                <div style={statsNumber}>90%</div>

                <div style={statsLabel}>
                  Real-world Accuracy
                </div>
              </div>

              <div style={statsCard}>
                <FaLaptopCode style={statsIcon} />

                <div style={statsNumber}>
                  Naive Bayes
                </div>

                <div style={statsLabel}>
                  ML Algorithm
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const statsCard = {
  background: "rgba(255,255,255,0.05)",
  borderRadius: "18px",
  padding: "25px",
  textAlign: "center",
};

const statsIcon = {
  color: "#8b5cf6",
  fontSize: "30px",
  marginBottom: "15px",
};

const statsNumber = {
  fontSize: "30px",
  fontWeight: "bold",
  color: "#ffffff",
  marginBottom: "8px",
};

const statsLabel = {
  fontSize: "14px",
  color: "#cbd5e1",
};

export default About;