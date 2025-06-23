import type { Metadata } from "next"
import Script from "next/script"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import "./globals.css"

export const metadata: Metadata = {
  title: "Antd Renderer",
  description: "Antd Renderer",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  )
}
