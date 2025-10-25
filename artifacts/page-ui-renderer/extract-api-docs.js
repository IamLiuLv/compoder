// 从components-data.json文件中提取组件的api输出到控制台

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input file path
const COMPONENTS_DATA_FILE = path.join(__dirname, 'components-data.json');

function loadComponentsData() {
  try {
    const jsonContent = fs.readFileSync(COMPONENTS_DATA_FILE, 'utf8');
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('❌ Error loading components data:', error.message);
    console.log('💡 Please ensure components-data.json exists. Run parse-components.js first.');
    process.exit(1);
  }
}

function findComponent(componentsData, componentName) {
  // Try exact match first
  if (componentsData[componentName]) {
    return { name: componentName, data: componentsData[componentName] };
  }
  
  // Try case-insensitive match
  const lowercaseName = componentName.toLowerCase();
  for (const [key, value] of Object.entries(componentsData)) {
    if (key.toLowerCase() === lowercaseName) {
      return { name: key, data: value };
    }
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(componentsData)) {
    if (key.toLowerCase().includes(lowercaseName) || lowercaseName.includes(key.toLowerCase())) {
      return { name: key, data: value };
    }
  }
  
  return null;
}

function generateApiMarkdown(components) {
  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  let markdown = `# Components API Documentation\n\n`;
  markdown += `This document contains the API documentation for the selected components.\n\n`;
  markdown += `**Components Count:** ${components.length}\n`;
  markdown += `**Generated:** ${timestamp}\n\n`;
  markdown += `---\n\n`;

  components.forEach((component, index) => {
    markdown += `# ${index + 1}. ${component.name}\n\n`;
    
    if (component.data.api) {
      markdown += `${component.data.api}\n\n`;
    } else {
      markdown += `*No API documentation available for this component.*\n\n`;
    }
    
    markdown += `---\n\n`;
  });

  return markdown;
}

function printUsage() {
  console.log(`
📖 Usage: node extract-api-docs.js [options] <component1> [component2] ...

Options:
  --output, -o <file>    Save output to file instead of printing to console
  --help, -h            Show this help message
  --list, -l            List all available components

Examples:
  node extract-api-docs.js Button Card Modal
  node extract-api-docs.js --output api-docs.md Button Card
  node extract-api-docs.js --list
  node extract-api-docs.js pricing testimonial
`);
}

function listAllComponents(componentsData) {
  const componentNames = Object.keys(componentsData).sort();
  console.log(`\n📋 Available Components (${componentNames.length} total):\n`);
  
  componentNames.forEach((name, index) => {
    console.log(`${(index + 1).toString().padStart(2, ' ')}. ${name}`);
  });
  
  console.log('\n💡 Use component names as arguments to extract their API documentation.');
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }
  
  // Parse arguments
  let outputFile = null;
  let componentNames = [];
  let showList = false;
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    } else if (arg === '--list' || arg === '-l') {
      showList = true;
    } else if (arg === '--output' || arg === '-o') {
      if (i + 1 < args.length) {
        outputFile = args[i + 1];
        i++; // Skip next argument
      } else {
        console.error('❌ Error: --output requires a filename');
        process.exit(1);
      }
    } else {
      componentNames.push(arg);
    }
  }
  
  // Load components data
  console.log('📖 Loading components data...');
  const componentsData = loadComponentsData();
  console.log(`✅ Loaded ${Object.keys(componentsData).length} components`);
  
  // Handle list command
  if (showList) {
    listAllComponents(componentsData);
    process.exit(0);
  }
  
  if (componentNames.length === 0) {
    console.error('❌ Error: Please provide at least one component name');
    printUsage();
    process.exit(1);
  }
  
  // Find components
  console.log(`\n🔍 Searching for components: ${componentNames.join(', ')}`);
  const foundComponents = [];
  const notFoundComponents = [];
  
  componentNames.forEach(name => {
    const component = findComponent(componentsData, name);
    if (component) {
      foundComponents.push(component);
      console.log(`✅ Found: ${component.name}`);
    } else {
      notFoundComponents.push(name);
      console.log(`❌ Not found: ${name}`);
    }
  });
  
  if (notFoundComponents.length > 0) {
    console.log(`\n⚠️  ${notFoundComponents.length} component(s) not found: ${notFoundComponents.join(', ')}`);
    console.log('💡 Use --list to see all available components');
  }
  
  if (foundComponents.length === 0) {
    console.log('\n❌ No components found. Exiting.');
    process.exit(1);
  }
  
  // Generate markdown
  console.log(`\n📝 Generating API documentation for ${foundComponents.length} component(s)...`);
  const markdown = generateApiMarkdown(foundComponents);
  
  // Output results
  if (outputFile) {
    fs.writeFileSync(outputFile, markdown, 'utf8');
    console.log(`\n✅ API documentation saved to: ${outputFile}`);
    console.log(`📊 Components documented: ${foundComponents.length}`);
    console.log(`📄 File size: ${(markdown.length / 1024).toFixed(1)} KB`);
  } else {
    console.log('\n' + '='.repeat(80));
    console.log('API DOCUMENTATION OUTPUT');
    console.log('='.repeat(80) + '\n');
    console.log(markdown);
  }
}

// Run the script
main(); 