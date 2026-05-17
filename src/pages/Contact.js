import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  globalBackground,
  cardStyle,
  buttonStyle,
} from "../styles/globalStyles";

import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div style={globalBackground}>
      <Navbar />

      <div style={{ padding: "60px 40px" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "52px",
            background:
              "linear-gradient(135deg, #ffffff, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Contact Us
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginBottom: "50px",
          }}
        >
          Get in touch with the ReqFLOW team
        </p>

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
          }}
        >
          {}
          <div style={cardStyle}>
            <h3 style={{ color: "#8b5cf6", marginBottom: "25px" }}>
              Contact Information
            </h3>

            <div style={infoRow}>
              <FaEnvelope style={iconStyle} />
              <span style={textStyle}>
                aleeza.asif@example.com
                bisma.zubair@example.com
              </span>
            </div>

            <div style={infoRow}>
              <FaPhone style={iconStyle} />
              <span style={textStyle}>
                +92 123 4567890
              </span>
            </div>

            <div style={infoRow}>
              <FaMapMarkerAlt style={iconStyle} />
              <span style={textStyle}>
                Islamabad, Pakistan
              </span>
            </div>

            <hr style={divider} />

            <h4 style={{ marginBottom: "15px" }}>
              Team Members
            </h4>

            <div style={infoRow}>
              <FaUser style={iconStyle} />
              <span style={textStyle}>
                 Aleeza Asif (01-134232-033)
                
              </span>
            </div>

            <div style={infoRow}>
              <FaUser style={iconStyle} />
              <span style={textStyle}>
               Bisma Zubair (01-134232-048)
              </span>
            </div>
          </div>

          {}
          <form onSubmit={handleSubmit} style={cardStyle}>
            <h3 style={{ color: "#8b5cf6", marginBottom: "20px" }}>
              Send Message
            </h3>

            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              required
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              required
              style={inputStyle}
            />

            <textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  message: e.target.value,
                })
              }
              required
              rows="5"
              style={textareaStyle}
            />

            <button
              type="submit"
              style={{
                ...buttonStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <FaPaperPlane />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid rgba(139,92,246,0.3)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  outline: "none",
};

const textareaStyle = {
  ...inputStyle,
  resize: "none",
};

const infoRow = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "15px",
};

const iconStyle = {
  color: "#8b5cf6",
};

const textStyle = {
  color: "#cbd5e1",
};

const divider = {
  border: "1px solid rgba(139,92,246,0.2)",
  margin: "20px 0",
};

export default Contact;