export interface DynamicComponentRendererProps {
  files: { [key: string]: string };
  entryFile: string;
  customRequire: (importPath: string) => any;
  onError: (errorMessage: string) => void;
  onSuccess: () => void;
}

export interface ModuleCache {
  [key: string]: {
    exports: any;
  };
}

export interface ExportsObject {
  [key: string]: any;
}

export interface ImportError {
  file: string;
  importPath: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ImportError[];
}
