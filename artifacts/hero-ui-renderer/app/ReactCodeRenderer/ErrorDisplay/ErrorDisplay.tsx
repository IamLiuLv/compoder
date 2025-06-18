import React, { useEffect, useState } from "react";
import type { ErrorDisplayProps } from "./interface";

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div
      style={{
        width: "90%",
        maxWidth: "800px",
        margin: "20px auto",
        padding: "24px",
        backgroundColor: "#1a1a1a",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 255, 0, 0.2)",
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : "20px"})`,
        transition: "all 0.3s ease-out",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "1px solid #333",
          paddingBottom: "12px",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: "#ff5f56",
            borderRadius: "50%",
            marginRight: "8px",
          }}
        />
        <div
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: "#ffbd2e",
            borderRadius: "50%",
            marginRight: "8px",
          }}
        />
        <div
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: "#27c93f",
            borderRadius: "50%",
          }}
        />
      </div>

      <h1
        style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#00ff00",
          margin: "0 0 20px 0",
          fontFamily: "monospace",
          textShadow: "0 0 5px rgba(0, 255, 0, 0.5)",
        }}
      >
        {">"} SYSTEM ERROR DETECTED
      </h1>

      <div
        style={{
          padding: "16px",
          backgroundColor: "#000",
          borderRadius: "4px",
          border: "1px solid #333",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        <div style={{ color: "#ff0000", marginBottom: "8px" }}>
          {">"} Error Stack Trace:
        </div>
        <pre
          style={{
            margin: 0,
            color: "#fff",
            fontSize: "14px",
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {errorMessage?.split("\n").map((line, index) => (
            <div
              key={index}
              style={{
                opacity: visible ? 1 : 0,
                transform: `translateX(${visible ? 0 : "20px"})`,
                transition: `all 0.3s ease-out ${index * 0.1}s`,
              }}
            >
              {line}
            </div>
          ))}
        </pre>
      </div>

      <div
        style={{
          marginTop: "20px",
          color: "#666",
          fontSize: "12px",
          fontFamily: "monospace",
          textAlign: "center",
        }}
      >
        * Please try clicking &quot;
        <span style={{ fontWeight: "bold" }}>EXECUTE AUTO FIX</span>
        &quot; in the bottom right corner to fix the issue. If you think this is
        a bug, please{" "}
        <a
          href="https://github.com/IamLiuLv/compoder/issues"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#666", textDecoration: "underline" }}
        >
          report it in Compoder&apos;s GitHub issues
        </a>
      </div>
    </div>
  );
};

export default ErrorDisplay;
