export const customRequire = (moduleName: string) => {
  const modules: { [key: string]: any } = {
    // base modules
    react: require('react'),
    'react-dom': require('react-dom'),
    'lucide-react': require('lucide-react'),
    'next/link': require('next/link'),
    'next/image': require('next/image'),
    '@/lib/utils': require('@/lib/utils'),
    'framer-motion': require('framer-motion'),
    '@monaco-editor/react': require('@monaco-editor/react'),
    '@tanstack/react-table': require('@tanstack/react-table'),
    'class-variance-authority': require('class-variance-authority'),
    clsx: require('clsx'),
    'github-slugger': require('github-slugger'),
    'monaco-editor': require('monaco-editor'),
    'react-day-picker': require('react-day-picker'),
    'react-hook-form': require('react-hook-form'),
    'react-resizable-panels': require('react-resizable-panels'),
  };

  if (modules[moduleName]) {
    return modules[moduleName];
  }

  if (moduleName.startsWith('@/components/shared/ui/')) {
    const componentName = moduleName.replace('@/components/shared/ui/', '');
    return require(`@/components/shared/ui/${componentName}`);
  }

  if (moduleName.startsWith('@/components/shared/')) {
    const componentName = moduleName.replace('@/components/shared/', '');
    return require(`@/components/shared/${componentName}`);
  }

  if (moduleName.startsWith('@/components/landing/')) {
    const componentName = moduleName.replace('@/components/landing/', '');
    return require(`@/components/landing/${componentName}`);
  }

  throw new Error(`Module ${moduleName} not found`);
};
