import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

import {
  FaSearch,
  FaTrash,
  FaHistory,
  FaCheckCircle,
  FaCircle,
} from "react-icons/fa";

function Classifier() {
  const [requirements, setRequirements] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentClassifications, setRecentClassifications] = useState([]);

  useEffect(() => {
    fetchRecentClassifications();
  }, []);

  const fetchRecentClassifications = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/recent"
      );
      const data = await response.json();
      setRecentClassifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteClassification = async (index) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/recent/${index}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchRecentClassifications();
      }
    } catch (error) {
      console.error("Error deleting classification:", error);
    }
  };

  const deleteAllClassifications = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all recent classifications?"
      )
    ) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/recent",
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          fetchRecentClassifications();
        }
      } catch (error) {
        console.error("Error deleting all classifications:", error);
      }
    }
  };

  const handleClassify = async () => {
    if (!requirements.trim()) return;

    setLoading(true);

    const lines = requirements
      .split("\n")
      .filter((line) => line.trim() !== "");

    let allResults = [];

    for (let req of lines) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/classify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              requirement: req,
            }),
          }
        );

        const data = await response.json();

        allResults.push({
          requirement: req,
          ...data,
        });
      } catch (error) {
        console.error(error);
      }
    }

    setResults(allResults);
    setLoading(false);

    fetchRecentClassifications();
  };

  const functionalExamples = () => {
    setRequirements(`The system shall allow users to login.
Users can generate reports.
Admin can delete accounts.`);
  };

  const nonFunctionalExamples = () => {
    setRequirements(`The website must load within 2 seconds.
The system should be secure.
The app must support 1000 users simultaneously.`);
  };

  const mixedExamples = () => {
    setRequirements(`Users can upload files.
The system must respond quickly.
Admin can manage users.
The app should be reliable.`);
  };

  const ProgressBar = ({ percentage, label, color }) => {
    return (
      <div style={progressBarContainer}>
        <div style={progressBarLabel}>
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
        <div style={progressBarBackground}>
          <div
            style={{
              ...progressBarFill,
              width: `${percentage}%`,
              background: color,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={pageStyle}>
      <Navbar />

      <div style={{ padding: "50px" }}>
        <h1 style={titleStyle}>
          Requirement Classifier
        </h1>

        <div style={mainGrid}>
          <div>
            <div style={cardStyle}>
              <h2>Enter Requirements</h2>

              <textarea
                value={requirements}
                onChange={(e) =>
                  setRequirements(e.target.value)
                }
                rows="10"
                placeholder="Enter multiple requirements..."
                style={textareaStyle}
              />

              <div style={buttonRow}>
                <button
                  style={smallBtn}
                  onClick={functionalExamples}
                >
                  Functional Examples
                </button>

                <button
                  style={smallBtn}
                  onClick={nonFunctionalExamples}
                >
                  Non-Functional Examples
                </button>

                <button
                  style={smallBtn}
                  onClick={mixedExamples}
                >
                  Mixed Examples
                </button>
              </div>

              <button
                onClick={handleClassify}
                style={classifyBtn}
              >
                {loading ? (
                  "Analyzing..."
                ) : (
                  <>
                    <FaSearch />
                    <span>CLASSIFY REQUIREMENTS</span>
                  </>
                )}
              </button>
            </div>

            {results.map((result, index) => (
              <div key={index} style={cardStyle}>
                <h2
                  style={{
                    color: "#8b5cf6",
                  }}
                >
                  Requirement {index + 1}
                </h2>

                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: 1.7,
                  }}
                >
                  {result.requirement}
                </p>

                <h2
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color:
                      result.prediction ===
                      "FUNCTIONAL"
                        ? "#34d399"
                        : "#a78bfa",
                  }}
                >
                  {result.prediction ===
                  "FUNCTIONAL" ? (
                    <>
                      <FaCheckCircle />
                      FUNCTIONAL
                    </>
                  ) : (
                    <>
                      <FaCircle />
                      NON-FUNCTIONAL
                    </>
                  )}
                </h2>

                <div style={probabilitySection}>
                  <ProgressBar
                    percentage={result.functional_prob}
                    label="Functional Probability"
                    color="linear-gradient(90deg, #8b5cf6, #a78bfa)"
                  />
                  <ProgressBar
                    percentage={result.nonfunctional_prob}
                    label="Non-Functional Probability"
                    color="linear-gradient(90deg, #8b5cf6, #a78bfa)"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <div style={cardStyle}>
              <div style={recentHeaderStyle}>
                <h2
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <FaHistory />
                  Recent Classifications
                </h2>

                {recentClassifications.length > 0 && (
                  <button
                    onClick={deleteAllClassifications}
                    style={deleteAllBtnStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "#dc2626";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "#ef4444";
                    }}
                  >
                    <FaTrash />
                    Delete All
                  </button>
                )}
              </div>

              {recentClassifications.length === 0 ? (
                <div style={emptyStateStyle}>
                  <p>No classifications yet</p>

                  <p
                    style={{
                      fontSize: "12px",
                      marginTop: "10px",
                    }}
                  >
                    Try classifying some requirements above
                  </p>
                </div>
              ) : (
                recentClassifications.map((item, index) => (
                  <div
                    key={index}
                    style={recentCard}
                  >
                    <div style={recentCardHeader}>
                      <span
                        style={{
                          background:
                            item.prediction ===
                            "FUNCTIONAL"
                              ? "#34d399"
                              : "#a78bfa",
                          padding: "5px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          color: "white",
                        }}
                      >
                        {item.prediction}
                      </span>

                      <button
                        onClick={() =>
                          deleteClassification(index)
                        }
                        style={deleteBtnStyle}
                        title="Delete this classification"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color =
                            "#ef4444";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            "#cbd5e1";
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <p
                      style={{
                        color: "#cbd5e1",
                        marginTop: "12px",
                        lineHeight: 1.5,
                        fontSize: "13px",
                      }}
                    >
                      {item.requirement}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  backgroundImage:
    "linear-gradient(rgba(2,6,23,0.94), rgba(2,6,23,0.96)), url('https://i.pinimg.com/736x/d9/ec/1f/d9ec1fea95a36efaaec346419007f342.jpg')",
  backgroundSize: "cover",
  color: "white",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "50px",
  fontSize: "50px",
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "30px",
};

const cardStyle = {
  background: "rgba(15,23,42,0.85)",
  padding: "30px",
  borderRadius: "20px",
  marginBottom: "25px",
  backdropFilter: "blur(10px)",
};

const textareaStyle = {
  width: "100%",
  maxWidth: "100%",
  minHeight: "220px",
  borderRadius: "15px",
  border: "none",
  padding: "20px",
  marginTop: "20px",
  background: "#1e293b",
  color: "white",
  resize: "vertical",
  fontSize: "15px",
  boxSizing: "border-box",
};

const buttonRow = {
  display: "flex",
  gap: "15px",
  marginTop: "20px",
  flexWrap: "wrap",
};

const smallBtn = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg,#6366f1,#8b5cf6)",
  color: "white",
  cursor: "pointer",
};

const classifyBtn = {
  width: "100%",
  marginTop: "25px",
  padding: "18px",
  border: "none",
  borderRadius: "15px",
  background:
    "linear-gradient(135deg,#6366f1,#8b5cf6)",
  color: "white",
  fontSize: "17px",
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
};

const recentHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const deleteAllBtnStyle = {
  background: "#ef4444",
  border: "none",
  borderRadius: "10px",
  padding: "10px 16px",
  color: "white",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const deleteBtnStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  color: "#cbd5e1",
  padding: "4px 8px",
  borderRadius: "8px",
  transition: "all 0.2s ease",
};

const recentCard = {
  background: "rgba(255,255,255,0.05)",
  padding: "15px",
  borderRadius: "15px",
  marginTop: "15px",
};

const recentCardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "40px 20px",
  color: "#cbd5e1",
};

const probabilitySection = {
  marginTop: "20px",
  paddingTop: "15px",
  borderTop: "1px solid rgba(255,255,255,0.1)",
};

const progressBarContainer = {
  marginBottom: "15px",
};

const progressBarLabel = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
  fontSize: "13px",
  color: "#cbd5e1",
};

const progressBarBackground = {
  width: "100%",
  height: "8px",
  backgroundColor: "rgba(255,255,255,0.1)",
  borderRadius: "10px",
  overflow: "hidden",
};

const progressBarFill = {
  height: "100%",
  borderRadius: "10px",
  transition: "width 0.5s ease-in-out",
};

export default Classifier;