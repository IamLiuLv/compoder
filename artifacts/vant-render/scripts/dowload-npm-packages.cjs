const fs = require("fs")
const path = require("path")
const https = require("https")
const { HttpsProxyAgent } = require("https-proxy-agent")

// 读取配置文件
const configPath = path.resolve(__dirname, "../npm-packages.json")
const npmConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"))

// 合并所有包路径
const npmPackages = [
  ...npmConfig.packages.map(pkg => pkg.path),
  ...npmConfig.css.map(pkg => pkg.path),
]

// 定义目标目录
const targetDir = path.resolve(__dirname, "../public/npm")

const proxy = "http://127.0.0.1:7890"
const agent = new HttpsProxyAgent(proxy)

// 从jsdelivr下载文件的函数
async function downloadFile(packagePath, targetPath) {
  return new Promise((resolve, reject) => {
    // 构建jsdelivr URL
    const jsdelivrUrl = `https://cdn.jsdelivr.net/npm/${packagePath}`

    // 确保目标目录存在
    fs.mkdirSync(path.dirname(targetPath), { recursive: true })

    // 创建写入流
    const fileStream = fs.createWriteStream(targetPath)

    // 发起HTTPS请求
    https
      .get(jsdelivrUrl, { agent }, response => {
        if (response.statusCode === 404) {
          fileStream.close()
          reject(new Error(`文件未找到: ${jsdelivrUrl}`))
          return
        }

        response.pipe(fileStream)

        fileStream.on("finish", () => {
          fileStream.close()
          console.log(`✅ 已下载: ${packagePath}`)
          resolve(true)
        })
      })
      .on("error", err => {
        fs.unlink(targetPath, () => {})
        reject(err)
      })
  })
}

// 主函数
async function main() {
  console.log("开始下载npm包文件...")

  try {
    // 确保目标根目录存在
    fs.mkdirSync(targetDir, { recursive: true })

    // 遍历并下载所有包
    for (const packagePath of npmPackages) {
      const targetPath = path.join(targetDir, packagePath)
      try {
        console.log(`✅ 开始下载: ${packagePath}`)
        if (fs.existsSync(targetPath)) {
          console.log(`✅ 文件已存在: ${packagePath}`)
          continue
        }
        await downloadFile(packagePath, targetPath)
      } catch (error) {
        console.error(`下载 ${packagePath} 时出错:`, error.message)
      }
    }

    console.log("✅ 所有文件下载完成！")
  } catch (error) {
    console.error("❌ 发生错误:", error.message)
    process.exit(1)
  }
}

// 运行主函数
main()
