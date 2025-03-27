"use client"

import React, { useState, useEffect } from "react"
import { Logo } from "../Logo"
import { CompoderBannerProps } from "./interface"
import { Sparkles, Code, Terminal, Lock, ShieldCheck, Zap } from "lucide-react"
import "./CompoderBanner.css"

// default theme colors
const DEFAULT_THEME_COLORS = {
  primaryBlue: "#3b82f6", // 明亮的蓝色
  deepBlue: "#1e40af", // 深蓝色
  neonBlue: "#00ffff", // 霓虹蓝
  primaryPurple: "#8b5cf6", // 紫色
  deepPurple: "#7c3aed", // 深紫色
  neonPurple: "#a78bfa", // 霓虹紫
  cyberCyan: "#22d3ee", // 赛博青色
}

export const CompoderBanner: React.FC<CompoderBannerProps> = ({
  title = "Compoder",
  subtitle = "AI-Powered Component Code Generator",
  description = "Your Stack, Your UI - Component Code Generator for Every Design Engineer",
  tagline = "Generate component code in seconds",
  className = "",
  cyberpunkLevel = "medium",
  matrixDensity = 50,
  glowColor,
  cornerStyle = "angled",
  colorTheme = "blueviolet",
  enableFlickerEffect = false,
  enableNeonTextEffect = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [matrixChars, setMatrixChars] = useState<string[]>([])

  // 根据赛博朋克级别控制效果
  const effectIntensity = {
    low: {
      matrixOpacity: 0.1,
      glowStrength: "10px",
      glitchAnimation: false,
      scanlineOpacity: 0.01,
      cornerSize: 4,
    },
    medium: {
      matrixOpacity: 0.2,
      glowStrength: "15px",
      glitchAnimation: true,
      scanlineOpacity: 0.03,
      cornerSize: 6,
    },
    high: {
      matrixOpacity: 0.3,
      glowStrength: "20px",
      glitchAnimation: true,
      scanlineOpacity: 0.05,
      cornerSize: 8,
    },
  }

  // 根据颜色主题选择合适的颜色
  const getThemeColors = () => {
    switch (colorTheme) {
      case "blue":
        return {
          primary: DEFAULT_THEME_COLORS.primaryBlue,
          secondary: DEFAULT_THEME_COLORS.deepBlue,
          accent: DEFAULT_THEME_COLORS.neonBlue,
          highlight: DEFAULT_THEME_COLORS.cyberCyan,
        }
      case "purple":
        return {
          primary: DEFAULT_THEME_COLORS.primaryPurple,
          secondary: DEFAULT_THEME_COLORS.deepPurple,
          accent: DEFAULT_THEME_COLORS.neonPurple,
          highlight: DEFAULT_THEME_COLORS.deepPurple,
        }
      default: // blueviolet
        return {
          primary: DEFAULT_THEME_COLORS.primaryBlue,
          secondary: DEFAULT_THEME_COLORS.primaryPurple,
          accent: DEFAULT_THEME_COLORS.neonBlue,
          highlight: DEFAULT_THEME_COLORS.cyberCyan,
        }
    }
  }

  const themeColors = getThemeColors()
  const currentEffect = effectIntensity[cyberpunkLevel]
  const primaryColor = glowColor || themeColors.accent

  // Generate random matrix characters
  useEffect(() => {
    const chars = []
    const possibleChars =
      cyberpunkLevel === "high"
        ? "01 react typescript tailwindcss vue html css"
        : "01"
    for (let i = 0; i < matrixDensity; i++) {
      chars.push(
        possibleChars.charAt(Math.floor(Math.random() * possibleChars.length)),
      )
    }
    setMatrixChars(chars)

    // Simulate loading effect
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [matrixDensity, cyberpunkLevel])

  // Random tech icons for cyber aesthetic with blue-purple theme
  const techIcons = [
    <Terminal
      key="terminal"
      size={16}
      style={{ color: themeColors.primary }}
    />,
    <Code key="code" size={16} style={{ color: themeColors.secondary }} />,
    <Lock key="lock" size={16} style={{ color: themeColors.accent }} />,
    <ShieldCheck
      key="shield"
      size={16}
      style={{ color: themeColors.highlight }}
    />,
    <Zap key="zap" size={16} style={{ color: themeColors.secondary }} />,
  ]

  // 处理不同的角落风格
  const getCornerStyle = () => {
    switch (cornerStyle) {
      case "squared":
        return "border-t-2 border-l-2"
      case "angled":
        return "border-t-2 border-l-2 transform -skew-x-12"
      case "rounded":
        return "rounded-tl-lg border-t-2 border-l-2"
      default:
        return "border-t-2 border-l-2"
    }
  }

  return (
    <div
      className={`w-full relative overflow-hidden ${className} cyber-grid ${
        enableFlickerEffect ? "cyber-flicker" : ""
      }`}
      style={
        {
          minHeight: "300px",
          transition: "opacity 0.5s ease-in-out",
          opacity: isLoaded ? 1 : 0.7,
          "--glow-color": primaryColor,
          "--primary-blue": DEFAULT_THEME_COLORS.primaryBlue,
          "--deep-blue": DEFAULT_THEME_COLORS.deepBlue,
          "--neon-blue": DEFAULT_THEME_COLORS.neonBlue,
          "--primary-purple": DEFAULT_THEME_COLORS.primaryPurple,
          "--deep-purple": DEFAULT_THEME_COLORS.deepPurple,
          "--neon-purple": DEFAULT_THEME_COLORS.neonPurple,
          "--cyber-cyan": DEFAULT_THEME_COLORS.cyberCyan,
        } as React.CSSProperties
      }
    >
      {/* Matrix background - blue-purple theme */}
      <div
        className="matrix-bg"
        style={{
          opacity: currentEffect.matrixOpacity,
          backgroundImage:
            colorTheme === "purple"
              ? `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext y='15' font-family='monospace' fill='%238b5cf6'%3E0%3C/text%3E%3Ctext x='10' y='15' font-family='monospace' fill='%23a78bfa'%3E1%3C/text%3E%3C/svg%3E")`
              : colorTheme === "blue"
              ? `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext y='15' font-family='monospace' fill='%233b82f6'%3E0%3C/text%3E%3Ctext x='10' y='15' font-family='monospace' fill='%2300ffff'%3E1%3C/text%3E%3C/svg%3E")`
              : `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext y='15' font-family='monospace' fill='%233b82f6'%3E0%3C/text%3E%3Ctext x='10' y='15' font-family='monospace' fill='%238b5cf6'%3E1%3C/text%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Gradient background - blue-purple theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-background/95 z-0">
        <div
          className="absolute inset-0 bg-gradient-to-br via-background z-0"
          style={{
            backgroundImage:
              colorTheme === "purple"
                ? "linear-gradient(to bottom right, rgba(139, 92, 246, 0.1), transparent, rgba(167, 139, 250, 0.1))"
                : colorTheme === "blue"
                ? "linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), transparent, rgba(0, 255, 255, 0.1))"
                : "linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), transparent, rgba(139, 92, 246, 0.1))",
          }}
        />
      </div>

      {/* CRT scanline effect - blue tint */}
      {cyberpunkLevel !== "low" && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent, rgba(${
              colorTheme === "purple"
                ? "139, 92, 246"
                : colorTheme === "blue"
                ? "59, 130, 246"
                : "34, 211, 238"
            }, ${currentEffect.scanlineOpacity}) 50%, transparent)`,
            backgroundSize: "100% 4px",
            animation: "scanline 8s linear infinite",
          }}
        ></div>
      )}

      {/* Animated floating matrices - blue-purple theme */}
      <div
        className="absolute inset-0 z-0"
        style={{ opacity: currentEffect.matrixOpacity }}
      >
        {matrixChars.map((char, i) => (
          <div
            key={i}
            className="absolute font-mono text-xs"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              color: i % 2 === 0 ? themeColors.accent : themeColors.secondary,
              opacity: 0.7,
              animation: `float ${
                2 + Math.random() * 5
              }s infinite ease-in-out ${Math.random() * 2}s, blink ${
                1 + Math.random() * 2
              }s infinite ${Math.random() * 2}s`,
            }}
          >
            {char}
          </div>
        ))}
      </div>

      {/* Glowing dots - alternating blue-purple */}
      <div className="absolute inset-0 opacity-10 z-0">
        {Array.from({
          length:
            cyberpunkLevel === "high"
              ? 25
              : cyberpunkLevel === "medium"
              ? 15
              : 8,
        }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor:
                i % 2 === 0 ? themeColors.accent : themeColors.secondary,
              boxShadow: `0 0 ${currentEffect.glowStrength} 3px ${
                i % 2 === 0 ? themeColors.accent : themeColors.secondary
              }`,
              animation: `pulse ${2 + Math.random() * 3}s infinite alternate ${
                Math.random() * 2
              }s`,
            }}
          />
        ))}
      </div>

      {/* Blue-Purple cyber grid */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage:
            colorTheme === "purple"
              ? `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(167, 139, 250, 0.1) 1px, transparent 1px)
            `
              : colorTheme === "blue"
              ? `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
            `
              : `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Main content */}
      <div className="relative z-10 py-8 sm:py-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Logo with glitch effect */}
          <div className="mb-4 relative">
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-70 animate-pulse"
              style={{ backgroundColor: `${themeColors.primary}30` }}
            ></div>
            <Logo
              width={64}
              height={64}
              className="relative z-10 animate-[float_4s_ease-in-out_infinite]"
            />
          </div>

          {/* Title with cyber effect */}
          <div className="flex items-center mb-3 sm:mb-4 gap-2 sm:gap-3 flex-wrap justify-center">
            <h1
              data-text={title}
              className={`${
                currentEffect.glitchAnimation ? "cyber-title" : ""
              } ${
                enableNeonTextEffect ? "blue-purple-gradient-text" : ""
              } text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r`}
              style={{
                backgroundImage: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})`,
              }}
            >
              {title}
            </h1>
          </div>

          {/* Subtitle with cyber glitch */}
          <h2
            className={`${
              currentEffect.glitchAnimation ? "cyber-glitch" : ""
            } ${
              enableNeonTextEffect
                ? colorTheme === "purple"
                  ? "neon-purple-text"
                  : colorTheme === "blue"
                  ? "neon-blue-text"
                  : ""
                : ""
            } text-lg sm:text-xl font-medium text-foreground/90 mb-3 sm:mb-4`}
          >
            {subtitle}
          </h2>

          {/* Description */}
          <p className="max-w-2xl text-muted-foreground text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed">
            {description}
          </p>

          {/* Animated tech icons - only for medium and high */}
          {cyberpunkLevel !== "low" && (
            <div className="flex gap-5 mb-6 justify-center">
              {techIcons.map((icon, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-lg bg-background/80 border flex items-center justify-center"
                  style={{
                    animation: `float ${
                      3 + index * 0.5
                    }s ease-in-out infinite ${index * 0.2}s`,
                    boxShadow: `0 0 10px ${
                      index % 2 === 0
                        ? `${themeColors.primary}80`
                        : `${themeColors.secondary}80`
                    }`,
                    borderColor:
                      index % 2 === 0
                        ? `${themeColors.primary}40`
                        : `${themeColors.secondary}40`,
                  }}
                >
                  {icon}
                </div>
              ))}
            </div>
          )}

          {/* Tagline with cyber styling - blue-purple theme */}
          <div
            className="flex items-center gap-2 mb-6 sm:mb-7 text-sm sm:text-base bg-gradient-to-r from-background/60 to-background/60 border rounded-md px-4 py-2 cyber-badge"
            style={{
              borderColor: `${themeColors.highlight}30`,
            }}
          >
            <Sparkles size={18} style={{ color: themeColors.highlight }} />
            <span
              className={`font-mono ${
                enableNeonTextEffect
                  ? colorTheme === "purple"
                    ? "neon-purple-text"
                    : colorTheme === "blue"
                    ? "neon-blue-text"
                    : ""
                  : ""
              }`}
              style={{ color: themeColors.highlight }}
            >
              &gt; {tagline}
            </span>
            <div
              className="w-2 h-4 animate-[blink_1s_infinite]"
              style={{ backgroundColor: themeColors.highlight }}
            ></div>
          </div>

          {/* Action buttons - blue-purple theme */}
          {/* <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group"
              style={{
                backgroundColor: themeColors.primary,
              }}
            >
              <span className="relative z-10">{actionButtonLabel}</span>
              <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    colorTheme === "blueviolet"
                      ? `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})`
                      : `linear-gradient(to right, ${themeColors.primary}, ${themeColors.accent})`,
                }}
              ></div>
            </Button>

            {showGithubStar && (
              <Button
                variant="outline"
                size="lg"
                className="hover:bg-violet-500/10 transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group"
                onClick={() => window.open(githubUrl, "_blank")}
                style={{
                  borderColor: `${themeColors.secondary}30`,
                }}
              >
                <span className="relative z-10">
                  <Star className="mr-2 h-4 w-4 text-amber-400 inline" /> Star
                  on GitHub
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to right, transparent, ${themeColors.secondary}20)`,
                  }}
                ></div>
              </Button>
            )}
          </div> */}
        </div>
      </div>

      {/* Tech edge border effect - blue-purple theme */}
      <div
        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        style={{
          background: `linear-gradient(to right, transparent, ${themeColors.primary}40, transparent)`,
        }}
      ></div>
      <div
        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
        style={{
          background: `linear-gradient(to bottom, transparent, ${themeColors.secondary}40, transparent)`,
        }}
      ></div>
      <div
        className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
        style={{
          background: `linear-gradient(to bottom, transparent, ${themeColors.secondary}40, transparent)`,
        }}
      ></div>
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        style={{
          background: `linear-gradient(to right, transparent, ${themeColors.primary}40, transparent)`,
        }}
      ></div>

      {/* Corner accents - alternating blue-purple */}
      <div
        className={`absolute top-0 left-0 w-${currentEffect.cornerSize} h-${
          currentEffect.cornerSize
        } ${getCornerStyle()}`}
        style={{ borderColor: `${themeColors.primary}60` }}
      ></div>
      <div
        className={`absolute top-0 right-0 w-${currentEffect.cornerSize} h-${
          currentEffect.cornerSize
        } ${getCornerStyle().replace("border-l-2", "border-r-2")}`}
        style={{ borderColor: `${themeColors.secondary}60` }}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-${currentEffect.cornerSize} h-${
          currentEffect.cornerSize
        } ${getCornerStyle().replace("border-t-2", "border-b-2")}`}
        style={{ borderColor: `${themeColors.secondary}60` }}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-${currentEffect.cornerSize} h-${
          currentEffect.cornerSize
        } ${getCornerStyle().replace(
          "border-t-2 border-l-2",
          "border-b-2 border-r-2",
        )}`}
        style={{ borderColor: `${themeColors.primary}60` }}
      ></div>
    </div>
  )
}
