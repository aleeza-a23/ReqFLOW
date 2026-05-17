import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "HOME" },
    { path: "/features", label: "FEATURES" },
    { path: "/classifier", label: "CLASSIFIER" },
    { path: "/about", label: "ABOUT" },
    { path: "/contact", label: "CONTACT" },
  ];

  const Logo = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {}
      <img
        src="https://i.imgur.com/your-logo.png"
        alt="ReqFlow Logo"
        style={{
          height: "42px",
          width: "auto",
          objectFit: "contain",
        }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />

      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: "700",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "1px",
          }}
        >
          ReqFlow  
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "10px",
            color: "#cbd5e1",
            letterSpacing: "1px",
          }}
        >
        </p>
      </div>
    </div>
  );

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isScrolled ? "14px 70px" : "20px 70px",
        background: isScrolled
          ? "rgba(15, 23, 42, 0.96)"
          : "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        transition: "all 0.3s ease",
        borderBottom: "1px solid rgba(139, 92, 246, 0.15)",
      }}
    >
      {}
     <Link
  to="/"
  style={{
    textDecoration: "none",
  }}
>
        <Logo />
      </Link>

      {}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
         marginLeft: "120px",
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              color:
                location.pathname === link.path ? "#8b5cf6" : "#ffffff",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px",
              position: "relative",
              paddingBottom: "6px",
              transition: "0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#8b5cf6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                location.pathname === link.path
                  ? "#8b5cf6"
                  : "#ffffff";
            }}
          >
            {link.label}

            {location.pathname === link.path && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: "100%",
                  height: "2px",
                  borderRadius: "2px",
                  background:
                    "linear-gradient(135deg, #6366f1, #8b5cf6)",
                }}
              />
            )}
          </Link>
        ))}
      </div>

      {}
      <div></div>
    </nav>
  );
}

export default Navbar;