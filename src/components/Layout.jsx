import React from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children, rightHeader, showBack, footerContent, headerRightContent }) {
  const navigate = useNavigate();

  return (
    <div id="app-container">
      <header className="app-header">
        <div className="header-left">
          {showBack ? (
            <button
              className="btn-header-back"
              onClick={() => navigate(-1)}
              aria-label="Back"
              title="Back"
            >
              ←
            </button>
          ) : (
            <div style={{ width: 60 }} />
          )}
        </div>

        <div className="header-center">
          <span className="header-title">{rightHeader}</span>
        </div>

        <div className="header-right">
          {headerRightContent}
        </div>
      </header>

      <main className="app-content">{children}</main>

      <footer className="app-footer">{footerContent}</footer>
    </div>
  );
}
