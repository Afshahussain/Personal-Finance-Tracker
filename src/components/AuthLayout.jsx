import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import auth1 from "../assets/auth1.png";
import auth2 from "../assets/auth2.png";
import auth3 from "../assets/auth3.png";

const AuthLayout = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => {
  const images = [auth1, auth2, auth3];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="auth-page">
      <div className="auth-left" style={{ position: "relative", padding: 0, overflow: "hidden" }}>
        
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Finance concept"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: index === currentSlide ? 1 : 0,
              transition: "opacity 1.2s ease-in-out",
              zIndex: 0
            }}
          />
        ))}

        {/* Subtle gradient overlay - bottom fade only so image is visible */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, width: "100%", height: "100%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
          zIndex: 1
        }}></div>

        {/* Brand content - positioned at bottom */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          padding: "48px 40px",
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)"
        }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "8px",
            padding: "6px 14px",
            marginBottom: "16px",
            fontSize: "0.8rem",
            fontWeight: "600",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.9)"
          }}>Finance Tracker</div>

          <h1 style={{
            margin: "0 0 14px",
            fontSize: "2.4rem",
            fontWeight: "800",
            color: "#ffffff",
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
            textShadow: "0 2px 20px rgba(0,0,0,0.4)"
          }}>Manage Your Money,{" "}<span style={{ color: "#60a5fa" }}>Smartly.</span></h1>

          <p style={{
            margin: "0 0 28px",
            fontSize: "1.05rem",
            color: "rgba(255,255,255,0.8)",
            lineHeight: 1.6,
            maxWidth: "380px"
          }}>
            Track income, expenses, budgets, and financial goals — all in one beautiful place.
          </p>

          {/* Slide Dots */}
          <div style={{ display: "flex", gap: "8px" }}>
            {images.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: i === currentSlide ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: i === currentSlide ? "#60a5fa" : "rgba(255,255,255,0.4)",
                  transition: "all 0.4s ease",
                  cursor: "pointer"
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          {children}

          <div className="auth-footer">
            <p>
              {footerText}{" "}
              <Link to={footerLinkTo}>{footerLinkText}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;