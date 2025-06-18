export const customRequire = (moduleName: string) => {
  const modules: { [key: string]: any } = {
    // base modules
    react: require("react"),
    "react-dom": require("react-dom"),
    "lucide-react": require("lucide-react"),
    "next/link": require("next/link"),
    "next/image": require("next/image"),
    "framer-motion": require("framer-motion"),
    "react-hook-form": require("react-hook-form"),
    recharts: require("recharts"),
    "@heroui/react": require("@heroui/react"),
  };

  if (modules[moduleName]) {
    return modules[moduleName];
  }

  throw new Error(`Module ${moduleName} not found`);
};
