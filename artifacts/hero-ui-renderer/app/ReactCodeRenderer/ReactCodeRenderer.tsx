import React, { useEffect, useState } from "react";
import { transform } from "@babel/standalone";
import path from "path-browserify";
import { ErrorDisplay } from "./ErrorDisplay";
import { ErrorBoundary } from "./ErrorBoundary";
import {
  DynamicComponentRendererProps,
  ModuleCache,
  ExportsObject,
} from "./interface";

// 添加全局类型声明
declare global {
  interface Window {
    _moduleImportMap: {
      [importPath: string]: {
        importingFile: string;
        importedModule: string;
      };
    };
  }
}

const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = ({
  files,
  entryFile,
  customRequire,
  onError,
  onSuccess,
}) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const modules: ModuleCache = {};

    const processFile = (filename: string): any => {
      if (modules[filename]) {
        return modules[filename].exports;
      }
      const code = files[filename];
      if (!code) {
        throw new Error(`File not found: ${filename}`);
      }

      const transformedCode = transform(code, {
        filename,
        presets: ["react", "env", "typescript"],
        plugins: ["transform-modules-commonjs"],
      }).code;

      const exports: ExportsObject = {};
      const myModule = { exports };

      const ComponentModule = new Function(
        "require",
        "module",
        "exports",
        "__filename",
        "React",
        transformedCode!
      );

      ComponentModule(
        (importPath: string) => {
          const resolvedPath = importPath.startsWith(".")
            ? path.join(path.dirname(filename), importPath).replace(/^\//, "")
            : importPath;

          const possiblePaths = [
            resolvedPath,
            resolvedPath + ".ts",
            resolvedPath + ".tsx",
            resolvedPath + "/index.ts",
            resolvedPath + "/index.tsx",
            resolvedPath.replace(/\.(ts|tsx)$/, ""),
          ];

          const normalizedPath = Object.keys(files).find((file) =>
            possiblePaths.includes(file)
          );

          if (normalizedPath) {
            try {
              const result = processFile(normalizedPath);

              if (
                result === undefined ||
                (typeof result === "object" &&
                  Object.keys(result).length === 0 &&
                  !result.default)
              ) {
                throw new Error(
                  `Module "${importPath}" imported in "${filename}" doesn't have any exports. Make sure you've correctly exported components/functions from this module.`
                );
              }

              return result;
            } catch (error) {
              if (error instanceof Error) {
                throw new Error(
                  `Error while processing import "${importPath}" in "${filename}": ${error.message}`
                );
              }
              throw error;
            }
          }

          // 处理外部依赖库导入
          try {
            const externalModule = customRequire(importPath);

            // 记录从哪个文件导入了哪个模块，用于错误分析
            const importRecord = {
              importingFile: filename,
              importedModule: importPath,
            };

            // 存储该导入记录
            if (!window._moduleImportMap) {
              window._moduleImportMap = {};
            }
            window._moduleImportMap[importPath] = importRecord;

            // 增强的Proxy，处理多种情况
            return new Proxy(externalModule, {
              get: (target, prop) => {
                // 排除Symbol和私有属性
                if (
                  typeof prop === "symbol" ||
                  prop.toString().startsWith("_")
                ) {
                  return target[prop];
                }

                // 检查属性是否存在于目标对象中
                if (prop in target) {
                  const value = target[prop];

                  // 检查值是否为undefined (即使属性存在但值为undefined)
                  if (value === undefined && prop !== "default") {
                    throw new Error(
                      `Component "${String(
                        prop
                      )}" exists in module "${importPath}" but its value is undefined. This may indicate a packaging or export issue with the module.`
                    );
                  }

                  return value;
                }

                // 特殊处理: 某些库可能有不同的导出方式，尝试寻找近似的组件名
                const keys = Object.keys(target);
                const similarNames = keys.filter(
                  (k) =>
                    k.toLowerCase() === String(prop).toLowerCase() ||
                    k.replace(/[_-]/g, "") === String(prop).replace(/[_-]/g, "")
                );

                if (similarNames.length > 0) {
                  const suggestions = similarNames.join(", ");
                  throw new Error(
                    `Component "${String(
                      prop
                    )}" does not exist in module "${importPath}". Did you mean: ${suggestions}?`
                  );
                }

                // 当访问不存在的属性时，抛出更明确的错误
                throw new Error(
                  `Component "${String(
                    prop
                  )}" does not exist in module "${importPath}". Available components are: ${Object.keys(
                    target
                  ).join(", ")}.`
                );
              },
            });
          } catch (error) {
            // 处理外部库加载错误
            if (error instanceof Error) {
              // 如果错误信息已经是我们的自定义错误，直接传递
              if (error.message.includes("does not exist in module")) {
                throw error;
              }
              throw new Error(
                `Error loading external module "${importPath}": ${error.message}`
              );
            }
            throw error;
          }
        },
        myModule,
        exports,
        filename,
        require("react")
      );

      modules[filename] = myModule;
      return myModule.exports;
    };

    const parseComponents = async () => {
      try {
        setError(null);
        processFile(entryFile);

        const exportedComponent = modules[entryFile].exports.default;
        if (!exportedComponent) {
          const errorMsg = `Component not found: The default export from "${entryFile}" is undefined. Please check if you've correctly exported your component with "export default YourComponent".`;
          setError(errorMsg);
          onError(errorMsg);
          return;
        }

        setComponent(() => exportedComponent);
        onSuccess();
      } catch (error: any) {
        console.error("parseComponents error:", error);

        // 增强错误信息处理 - 检测未定义组件的使用
        const undefinedComponentMatch = error.message.match(
          /type is invalid.*?but got: undefined.*?You likely forgot to export/i
        );
        const missingComponentMatch = error.message.match(
          /Component "([^"]+)" does not exist in module "([^"]+)"/
        );

        if (missingComponentMatch) {
          // 直接使用我们的自定义错误信息
          setError(error.message);
          onError(error.message);
        } else if (undefinedComponentMatch) {
          // 尝试从错误堆栈中提取组件名称
          const componentNameMatch = error.stack?.match(
            /at ([A-Za-z0-9_]+) \(/
          );
          const componentName = componentNameMatch
            ? componentNameMatch[1]
            : "Unknown";

          // 提取可能的导入源
          const importSourceMatch = error.stack?.match(/from ['"]([^'"]+)['"]/);
          const importSource = importSourceMatch
            ? importSourceMatch[1]
            : "a module";

          const enhancedErrorMsg = `Missing component error: The component "${componentName}" being rendered is undefined. This often happens when you import a non-existent component (e.g., from ${importSource}). Please check your imports and make sure all components exist in their respective packages.`;
          setError(enhancedErrorMsg);
          onError(enhancedErrorMsg);
        } else {
          setError("parse component error: " + error.message);
          onError("parse component error: " + error.message);
        }
      }
    };

    parseComponents();
  }, [files, entryFile, customRequire, onError]);

  if (error) {
    return <ErrorDisplay errorMessage={error} />;
  }

  if (!Component) {
    return null;
  }

  return (
    <ErrorBoundary onError={onError} files={files}>
      <Component />
    </ErrorBoundary>
  );
};

export default DynamicComponentRenderer;
