function addCss(href: string) {
  const link = document.createElement("link")
  link.setAttribute("rel", "stylesheet")
  link.setAttribute("href", href)
  document.head.appendChild(link)
}

function addScript(src: string) {
  const script = document.createElement("script")
  script.setAttribute("src", src)
  document.body.appendChild(script)
}

// 添加 @arco-design/web-vue 组件库的样式文件
addCss("#CURRENT_ORIGIN#/npm/vant@4.9.19/lib/index.css")

// 添加 tainwindcss 的样式文件
addScript(
  // "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
  "#CURRENT_ORIGIN#/npm/@tailwindcss/browser@4.1.4/dist/index.global.min.js",
)
