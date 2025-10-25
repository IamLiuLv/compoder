import React, { useEffect, useState } from 'react';
import { transform } from '@babel/standalone';
import path from 'path-browserify';
import { ErrorDisplay } from './ErrorDisplay';
import { ErrorBoundary } from './ErrorBoundary';
import {
  DynamicComponentRendererProps,
  ModuleCache,
  ExportsObject,
  ImportError,
} from './interface';

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

// 依赖分析器
const extractImports = (code: string): string[] => {
  const imports: string[] = [];

  // 多种导入模式的正则表达式
  const importPatterns = [
    // import ... from 'module'
    /import\s+(?:(?:\*\s+as\s+\w+)|(?:\w+)|(?:\{[^}]*\}))\s+from\s*['"`]([^'"`]+)['"`]/g,
    // import 'module'
    /import\s*['"`]([^'"`]+)['"`]/g,
    // require('module')
    /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
    // dynamic import()
    /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
  ];

  for (const pattern of importPatterns) {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      const importPath = match[1];
      if (importPath && !imports.includes(importPath)) {
        imports.push(importPath);
      }
    }
  }

  return imports;
};

// 路径解析函数
const resolveImportPath = (
  filename: string,
  importPath: string,
  files: { [key: string]: string },
) => {
  const resolvedPath = importPath.startsWith('.')
    ? path.join(path.dirname(filename), importPath).replace(/^\//, '')
    : importPath;

  const possiblePaths = [
    resolvedPath,
    resolvedPath + '.ts',
    resolvedPath + '.tsx',
    resolvedPath + '/index.ts',
    resolvedPath + '/index.tsx',
    resolvedPath.replace(/\.(ts|tsx)$/, ''),
  ];

  return Object.keys(files).find((file) => possiblePaths.includes(file));
};

// 外部模块处理函数
const handleExternalModule = (
  importPath: string,
  customRequire: (importPath: string) => any,
) => {
  try {
    const externalModule = customRequire(importPath);

    // 基础的Proxy，主要用于运行时错误处理
    return new Proxy(externalModule, {
      get: (target, prop) => {
        // 排除Symbol和私有属性
        if (typeof prop === 'symbol' || prop.toString().startsWith('_')) {
          return target[prop];
        }

        // 如果属性存在，直接返回
        if (prop in target) {
          return target[prop];
        }

        // 运行时错误 - 这种情况理论上在第一阶段应该已经被捕获
        throw new Error(
          `Component "${String(prop)}" does not exist in module "${importPath}". This error should have been caught during validation phase.`,
        );
      },
    });
  } catch (error) {
    // 运行时外部库加载错误 - 理论上在第一阶段应该已经被捕获
    if (error instanceof Error) {
      throw new Error(
        `Runtime error loading external module "${importPath}": ${error.message}`,
      );
    }
    throw error;
  }
};

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
    const importErrors: ImportError[] = [];

    // 预处理阶段：分析所有文件的依赖关系并收集错误
    const validateAllImports = () => {
      const fileKeys = Object.keys(files);

      for (const filename of fileKeys) {
        const code = files[filename];
        const imports = extractImports(code);

        for (const importPath of imports) {
          try {
            validateSingleImport(filename, importPath);
          } catch (error) {
            if (error instanceof Error) {
              importErrors.push({
                file: filename,
                importPath,
                message: error.message,
              });
            }
          }
        }
      }
    };

    const validateSingleImport = (filename: string, importPath: string) => {
      const normalizedPath = resolveImportPath(filename, importPath, files);

      if (normalizedPath) {
        // 本地文件存在，验证是否有导出
        const targetCode = files[normalizedPath];
        if (!targetCode.includes('export')) {
          throw new Error(
            `Module "${importPath}" imported in "${filename}" doesn't have any exports. Make sure you've correctly exported components/functions from this module.`,
          );
        }
      } else {
        // 检查外部依赖 - 在第一阶段进行完整验证
        try {
          const externalModule = customRequire(importPath);

          if (importPath === 'react') {
            console.log('externalModule', externalModule);
          }

          // 验证模块是否为空或无效
          if (
            !externalModule ||
            (typeof externalModule === 'object' &&
              Object.keys(externalModule).length === 0)
          ) {
            throw new Error(
              `External module "${importPath}" could not be loaded or is empty.`,
            );
          }

          // 进一步验证：尝试分析代码中可能使用的组件
          const fileContent = files[filename];
          const componentUsageRegex = new RegExp(
            `import\\s*{([^}]+)}\\s*from\\s*['"\`]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`,
            'g',
          );
          const defaultImportRegex = new RegExp(
            `import\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*from\\s*['"\`]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`,
            'g',
          );

          // 检查命名导入
          let match = componentUsageRegex.exec(fileContent);
          if (match) {
            const importedComponents = match[1]
              .split(',')
              .map((comp) => comp.trim().split(' as ')[0].trim());
            const componentErrors: string[] = [];

            for (const componentName of importedComponents) {
              if (componentName && !(componentName in externalModule)) {
                // 寻找相似的组件名
                const keys = Object.keys(externalModule);
                const similarNames = keys.filter(
                  (k) =>
                    k.toLowerCase() === componentName.toLowerCase() ||
                    k.replace(/[_-]/g, '') ===
                      componentName.replace(/[_-]/g, ''),
                );

                if (similarNames.length > 0) {
                  const suggestions = similarNames.join(', ');
                  componentErrors.push(
                    `Component "${componentName}" does not exist in module "${importPath}". Did you mean: ${suggestions}?`,
                  );
                } else {
                  componentErrors.push(
                    `Component "${componentName}" does not exist in module "${importPath}".`,
                  );
                }
              }

              // 检查组件值是否为undefined
              if (
                componentName in externalModule &&
                externalModule[componentName] === undefined
              ) {
                componentErrors.push(
                  `Component "${componentName}" exists in module "${importPath}" but its value is undefined. This may indicate a packaging or export issue with the module.`,
                );
              }
            }

            // 如果有组件错误，统一抛出
            if (componentErrors.length > 0) {
              throw new Error(componentErrors.join('\n'));
            }
          }
        } catch (error) {
          throw new Error(
            `Error loading external module "${importPath}": ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      }
    };

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
        presets: ['react', 'env', 'typescript'],
        plugins: ['transform-modules-commonjs'],
      }).code;

      const exports: ExportsObject = {};
      const myModule = { exports };

      const ComponentModule = new Function(
        'require',
        'module',
        'exports',
        '__filename',
        'React',
        transformedCode!,
      );

      ComponentModule(
        (importPath: string) => {
          const normalizedPath = resolveImportPath(filename, importPath, files);

          if (normalizedPath) {
            try {
              const result = processFile(normalizedPath);

              if (
                result === undefined ||
                (typeof result === 'object' &&
                  Object.keys(result).length === 0 &&
                  !result.default)
              ) {
                throw new Error(
                  `Module "${importPath}" imported in "${filename}" doesn't have any exports. Make sure you've correctly exported components/functions from this module.`,
                );
              }

              return result;
            } catch (error) {
              if (error instanceof Error) {
                throw new Error(
                  `Error while processing import "${importPath}" in "${filename}": ${error.message}`,
                );
              }
              throw error;
            }
          }

          // 处理外部依赖库导入 - 复用现有逻辑
          return handleExternalModule(importPath, customRequire);
        },
        myModule,
        exports,
        filename,
        require('react'),
      );

      modules[filename] = myModule;
      return myModule.exports;
    };

    const parseComponents = async () => {
      try {
        setError(null);

        // 第一阶段：验证所有导入
        validateAllImports();

        // 如果有导入错误，统一抛出
        if (importErrors.length > 0) {
          const errorSummary =
            `Found ${importErrors.length} import error(s):\n\n` +
            importErrors
              .map(
                (err, index) =>
                  `${index + 1}. In file "${err.file}":\n   Import "${err.importPath}": ${err.message}`,
              )
              .join('\n\n');

          setError(errorSummary);
          onError(errorSummary);
          return;
        }

        // 第二阶段：处理文件和渲染组件
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
        console.error('parseComponents error:', error);

        // 增强错误信息处理 - 检测未定义组件的使用
        const undefinedComponentMatch = error.message.match(
          /type is invalid.*?but got: undefined.*?You likely forgot to export/i,
        );
        const missingComponentMatch = error.message.match(
          /Component "([^"]+)" does not exist in module "([^"]+)"/,
        );

        if (missingComponentMatch) {
          // 直接使用我们的自定义错误信息
          setError(error.message);
          onError(error.message);
        } else if (undefinedComponentMatch) {
          // 尝试从错误堆栈中提取组件名称
          const componentNameMatch = error.stack?.match(
            /at ([A-Za-z0-9_]+) \(/,
          );
          const componentName = componentNameMatch
            ? componentNameMatch[1]
            : 'Unknown';

          // 提取可能的导入源
          const importSourceMatch = error.stack?.match(/from ['"]([^'"]+)['"]/);
          const importSource = importSourceMatch
            ? importSourceMatch[1]
            : 'a module';

          const enhancedErrorMsg = `Missing component error: The component "${componentName}" being rendered is undefined. This often happens when you import a non-existent component (e.g., from ${importSource}). Please check your imports and make sure all components exist in their respective packages.`;
          setError(enhancedErrorMsg);
          onError(enhancedErrorMsg);
        } else {
          setError('parse component error: ' + error.message);
          onError('parse component error: ' + error.message);
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
