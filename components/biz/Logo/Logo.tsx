import React from "react"
import { LogoProps } from "./interface"

export const Logo: React.FC<LogoProps> = ({
  width = 200,
  height = 200,
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="logo"
    >
      <defs>
        <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3B82F6" }} />
          <stop offset="50%" style={{ stopColor: "#6366F1" }} />
          <stop offset="100%" style={{ stopColor: "#8B5CF6" }} />
        </linearGradient>

        <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#6366F1" }} />
          <stop offset="100%" style={{ stopColor: "#8B5CF6" }} />
        </linearGradient>
      </defs>

      <path
        d="M140 70 A50 50 0 1 0 140 130"
        fill="none"
        stroke="url(#techGradient)"
        strokeWidth={12}
        strokeLinecap="round"
      />

      <path
        d="M85 80 L65 100 L85 120"
        fill="none"
        stroke="url(#codeGradient)"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M115 80 L135 100 L115 120"
        fill="none"
        stroke="url(#codeGradient)"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
