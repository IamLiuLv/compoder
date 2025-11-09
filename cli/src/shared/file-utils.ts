import * as fs from "fs"
import * as path from "path"

/**
 * 确保目录存在,如果不存在则创建
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * 写入 JSON 配置文件
 */
export function writeJsonFile(filePath: string, data: any): void {
  const dir = path.dirname(filePath)
  ensureDir(dir)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
}

/**
 * 写入 Markdown 文件
 */
export function writeMarkdownFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath)
  ensureDir(dir)
  fs.writeFileSync(filePath, content, "utf-8")
}

/**
 * 将文本转换为 slug 格式
 * 例如: "Landing Page Codegen" → "landing-page-codegen"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // 移除非字母数字字符(除了空格和连字符)
    .replace(/[\s_]+/g, "-") // 将空格和下划线替换为连字符
    .replace(/^-+|-+$/g, "") // 移除开头和结尾的连字符
}

/**
 * 检查文件是否存在
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath)
}

/**
 * 读取 JSON 文件
 */
export function readJsonFile<T = any>(filePath: string): T {
  const content = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(content)
}
