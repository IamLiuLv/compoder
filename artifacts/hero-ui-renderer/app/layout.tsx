import "@/app/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "HeroUI(NextUI) Renderer",
  description: "HeroUI(NextUI) Renderer",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased"
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {children}
        </Providers>
        
        {/* Tailwind CDN */}
        <script src="https://cdn.tailwindcss.com"></script>

        {/* Tailwind CDN Configuration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            tailwind.config = {
              darkMode: ["class"],
              theme: {
                extend: {
                  colors: {
                    background: "hsl(var(--background))",
                    foreground: "hsl(var(--foreground))",
                    card: {
                      DEFAULT: "hsl(var(--card))",
                      foreground: "hsl(var(--card-foreground))",
                    },
                    popover: {
                      DEFAULT: "hsl(var(--popover))",
                      foreground: "hsl(var(--popover-foreground))",
                    },
                    primary: {
                      DEFAULT: "hsl(var(--primary))",
                      foreground: "hsl(var(--primary-foreground))",
                    },
                    secondary: {
                      DEFAULT: "hsl(var(--secondary))",
                      foreground: "hsl(var(--secondary-foreground))",
                    },
                    muted: {
                      DEFAULT: "hsl(var(--muted))",
                      foreground: "hsl(var(--muted-foreground))",
                    },
                    accent: {
                      DEFAULT: "hsl(var(--accent))",
                      foreground: "hsl(var(--accent-foreground))",
                    },
                    destructive: {
                      DEFAULT: "hsl(var(--destructive))",
                      foreground: "hsl(var(--destructive-foreground))",
                    },
                    border: "hsl(var(--border))",
                    input: "hsl(var(--input))",
                    ring: "hsl(var(--ring))",
                  },
                  borderRadius: {
                    lg: "var(--radius)",
                    md: "calc(var(--radius) - 2px)",
                    sm: "calc(var(--radius) - 4px)",
                  },
                },
                // 直接覆盖默认主题配置
                borderColor: {
                  DEFAULT: "hsl(var(--border))",  // 设置默认边框颜色
                },
              },
              // 添加CSS基本样式
              plugins: [
                function({ addBase }) {
                  addBase({
                    '*': { 
                      borderColor: 'hsl(var(--border))'
                    },
                    ':root': {
                      '--background': '0 0% 100%',
                      '--foreground': '240 10% 3.9%',
                      '--card': '0 0% 100%',
                      '--card-foreground': '240 10% 3.9%',
                      '--popover': '0 0% 100%',
                      '--popover-foreground': '240 10% 3.9%',
                      '--primary': '240 5.9% 10%',
                      '--primary-foreground': '0 0% 98%',
                      '--secondary': '240 4.8% 95.9%',
                      '--secondary-foreground': '240 5.9% 10%',
                      '--muted': '240 4.8% 95.9%',
                      '--muted-foreground': '240 3.8% 46.1%',
                      '--accent': '240 4.8% 95.9%',
                      '--accent-foreground': '240 5.9% 10%',
                      '--destructive': '0 84.2% 60.2%',
                      '--destructive-foreground': '0 0% 98%',
                      '--border': '240 5.9% 90%',
                      '--input': '240 5.9% 90%',
                      '--ring': '240 10% 3.9%',
                      '--radius': '0.5rem',
                      '--chart-1': '12 76% 61%',
                      '--chart-2': '173 58% 39%',
                      '--chart-3': '197 37% 24%',
                      '--chart-4': '43 74% 66%',
                      '--chart-5': '27 87% 67%',
                      '--sidebar-background': '0 0% 98%',
                      '--sidebar-foreground': '240 5.3% 26.1%',
                      '--sidebar-primary': '240 5.9% 10%',
                      '--sidebar-primary-foreground': '0 0% 98%',
                      '--sidebar-accent': '240 4.8% 95.9%',
                      '--sidebar-accent-foreground': '240 5.9% 10%',
                      '--sidebar-border': '220 13% 91%',
                      '--sidebar-ring': '217.2 91.2% 59.8%'
                    },
                    '.dark': {
                      '--background': '240 10% 3.9%',
                      '--foreground': '0 0% 98%',
                      '--card': '240 10% 3.9%',
                      '--card-foreground': '0 0% 98%',
                      '--popover': '240 10% 3.9%',
                      '--popover-foreground': '0 0% 98%',
                      '--primary': '0 0% 98%',
                      '--primary-foreground': '240 5.9% 10%',
                      '--secondary': '240 3.7% 15.9%',
                      '--secondary-foreground': '0 0% 98%',
                      '--muted': '240 3.7% 15.9%',
                      '--muted-foreground': '240 5% 64.9%',
                      '--accent': '240 3.7% 15.9%',
                      '--accent-foreground': '0 0% 98%',
                      '--destructive': '0 62.8% 30.6%',
                      '--destructive-foreground': '0 0% 98%',
                      '--border': '240 3.7% 15.9%',
                      '--input': '240 3.7% 15.9%',
                      '--ring': '240 4.9% 83.9%',
                      '--chart-1': '220 70% 50%',
                      '--chart-2': '160 60% 45%',
                      '--chart-3': '30 80% 55%',
                      '--chart-4': '280 65% 60%',
                      '--chart-5': '340 75% 55%',
                      '--sidebar-background': '240 5.9% 10%',
                      '--sidebar-foreground': '240 4.8% 95.9%',
                      '--sidebar-primary': '224.3 76.3% 48%',
                      '--sidebar-primary-foreground': '0 0% 100%',
                      '--sidebar-accent': '240 3.7% 15.9%',
                      '--sidebar-accent-foreground': '240 4.8% 95.9%',
                      '--sidebar-border': '240 3.7% 15.9%',
                      '--sidebar-ring': '217.2 91.2% 59.8%'
                    }
                  })
                }
              ]
            }
          `,
          }}
        />

        {/* 额外CSS变量注入，确保CSS变量在iframe中可用 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --background: 0 0% 100%;
              --foreground: 240 10% 3.9%;
              --card: 0 0% 100%;
              --card-foreground: 240 10% 3.9%;
              --popover: 0 0% 100%;
              --popover-foreground: 240 10% 3.9%;
              --primary: 240 5.9% 10%;
              --primary-foreground: 0 0% 98%;
              --secondary: 240 4.8% 95.9%;
              --secondary-foreground: 240 5.9% 10%;
              --muted: 240 4.8% 95.9%;
              --muted-foreground: 240 3.8% 46.1%;
              --accent: 240 4.8% 95.9%;
              --accent-foreground: 240 5.9% 10%;
              --destructive: 0 84.2% 60.2%;
              --destructive-foreground: 0 0% 98%;
              --border: 240 5.9% 90%;
              --input: 240 5.9% 90%;
              --ring: 240 10% 3.9%;
              --radius: 0.5rem;
              --chart-1: 12 76% 61%;
              --chart-2: 173 58% 39%;
              --chart-3: 197 37% 24%;
              --chart-4: 43 74% 66%;
              --chart-5: 27 87% 67%;
              --sidebar-background: 0 0% 98%;
              --sidebar-foreground: 240 5.3% 26.1%;
              --sidebar-primary: 240 5.9% 10%;
              --sidebar-primary-foreground: 0 0% 98%;
              --sidebar-accent: 240 4.8% 95.9%;
              --sidebar-accent-foreground: 240 5.9% 10%;
              --sidebar-border: 220 13% 91%;
              --sidebar-ring: 217.2 91.2% 59.8%;
            }
            
            .dark {
              --background: 240 10% 3.9%;
              --foreground: 0 0% 98%;
              --card: 240 10% 3.9%;
              --card-foreground: 0 0% 98%;
              --popover: 240 10% 3.9%;
              --popover-foreground: 0 0% 98%;
              --primary: 0 0% 98%;
              --primary-foreground: 240 5.9% 10%;
              --secondary: 240 3.7% 15.9%;
              --secondary-foreground: 0 0% 98%;
              --muted: 240 3.7% 15.9%;
              --muted-foreground: 240 5% 64.9%;
              --accent: 240 3.7% 15.9%;
              --accent-foreground: 0 0% 98%;
              --destructive: 0 62.8% 30.6%;
              --destructive-foreground: 0 0% 98%;
              --border: 240 3.7% 15.9%;
              --input: 240 3.7% 15.9%;
              --ring: 240 4.9% 83.9%;
              --chart-1: 220 70% 50%;
              --chart-2: 160 60% 45%;
              --chart-3: 30 80% 55%;
              --chart-4: 280 65% 60%;
              --chart-5: 340 75% 55%;
              --sidebar-background: 240 5.9% 10%;
              --sidebar-foreground: 240 4.8% 95.9%;
              --sidebar-primary: 224.3 76.3% 48%;
              --sidebar-primary-foreground: 0 0% 100%;
              --sidebar-accent: 240 3.7% 15.9%;
              --sidebar-accent-foreground: 240 4.8% 95.9%;
              --sidebar-border: 240 3.7% 15.9%;
              --sidebar-ring: 217.2 91.2% 59.8%;
            }
            
            * {
              border-color: hsl(var(--border));
            }
            
            body {
              background-color: hsl(var(--background));
              color: hsl(var(--foreground));
            }
            
            .scrollbar-hide {
              -ms-overflow-style: none; /* IE and Edge */
              scrollbar-width: none; /* Firefox */
            }
            
            .scrollbar-hide::-webkit-scrollbar {
              display: none; /* Chrome, Safari and Opera */
            }
            `,
          }}
        />
      </body>
    </html>
  );
}
