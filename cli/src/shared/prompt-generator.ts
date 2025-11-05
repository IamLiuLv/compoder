import * as path from "path"
import { CodegenRule } from "./types"
import { ensureDir, writeMarkdownFile, slugify } from "./file-utils"
import { Logger } from "./utils"

/**
 * 为 Cursor 设置规则文件
 */
export async function setupCursorRules(
  currentDir: string,
  codegenName: string,
  rules: CodegenRule[],
): Promise<void> {
  Logger.info("Setting up Cursor rules...")

  const folderName = slugify(codegenName)
  const rulesDir = path.join(
    currentDir,
    ".cursor",
    "rules",
    "compoder",
    folderName,
  )

  // 创建规则目录
  ensureDir(rulesDir)

  // 生成 index.mdc
  const indexMdcPath = path.join(rulesDir, "index.mdc")
  const indexMdcContent = generateIndexMdc(codegenName, folderName)
  writeMarkdownFile(indexMdcPath, indexMdcContent)
  Logger.success(`Created ${path.relative(currentDir, indexMdcPath)}`)

  // 生成 step1.md
  const step1MdPath = path.join(rulesDir, "step1.md")
  const step1MdContent = generateStep1Md(rules, codegenName)
  writeMarkdownFile(step1MdPath, step1MdContent)
  Logger.success(`Created ${path.relative(currentDir, step1MdPath)}`)

  // 生成 step2.md
  const step2MdPath = path.join(rulesDir, "step2.md")
  const step2MdContent = generateStep2Md(rules, codegenName)
  writeMarkdownFile(step2MdPath, step2MdContent)
  Logger.success(`Created ${path.relative(currentDir, step2MdPath)}`)

  Logger.success(`Cursor rules setup completed for ${codegenName}\n`)
}

/**
 * 为 Claude Code 设置规则文件
 */
export async function setupClaudeCodeRules(
  currentDir: string,
  codegenName: string,
  rules: CodegenRule[],
): Promise<void> {
  Logger.info("Setting up Claude Code rules...")

  const folderName = slugify(codegenName)
  const rulesDir = path.join(currentDir, ".claude", "skills", folderName)

  // 创建规则目录
  ensureDir(rulesDir)

  // 生成 SKILL.md
  const skillMdPath = path.join(rulesDir, "SKILL.md")
  const skillMdContent = generateClaudeSkillMd(codegenName, folderName)
  writeMarkdownFile(skillMdPath, skillMdContent)
  Logger.success(`Created ${path.relative(currentDir, skillMdPath)}`)

  // 生成 step1.md
  const step1MdPath = path.join(rulesDir, "step1.md")
  const step1MdContent = generateStep1Md(rules, codegenName)
  writeMarkdownFile(step1MdPath, step1MdContent)
  Logger.success(`Created ${path.relative(currentDir, step1MdPath)}`)

  // 生成 step2.md
  const step2MdPath = path.join(rulesDir, "step2.md")
  const step2MdContent = generateStep2Md(rules, codegenName)
  writeMarkdownFile(step2MdPath, step2MdContent)
  Logger.success(`Created ${path.relative(currentDir, step2MdPath)}`)

  Logger.success(`Claude Code rules setup completed for ${codegenName}\n`)
}

/**
 * 生成 Claude Code SKILL.md 入口文件
 */
export function generateClaudeSkillMd(
  codegenName: string,
  folderName: string,
): string {
  return `---
name: ${folderName}
description: compoder ${codegenName}
---

# ${codegenName} Component Generation Orchestration

When the user references this rule document, the system will execute component generation according to the following workflow:

1. Design component specification (Component Design)
2. Generate component code based on the design

**Important Notes:**

- The required step files must be read completely step by step, and only after one step is completed can the next step file be read
- Each step should be executed sequentially to ensure proper component generation
- Do not load all step file contents at once - read them progressively as needed

## State Management and Execution Mechanism

The system will maintain the following state variables:

- \`current_step\`: The current execution step (1-2)
- \`user_requirements\`: User's component requirements or design draft
- \`component_design\`: Component design information from step 1
- \`component_code\`: Generated component code from step 2

### Complete Step File Reading Mechanism

Since step files may exceed the single reading limit, the system will:

1. **Use multi-segment reading**: Read each step file completely in multiple times, without omitting any content
2. **Verify completeness**: Ensure the step file has been completely read by checking the end of file content
3. **Maintain context**: Maintain the overall context and coherence of the step file when reading multiple segments

## Step Details

### Step 1: Design Component Specification

**Trigger condition**: \`current_step = 1\` and the user has provided component requirements

**Actions**:

1. Completely read the \`step1.md\` file content from this Skill directory (\`.claude/skills/${folderName}/step1.md\`)
2. Apply this rule to design the component and extract required information
3. Update \`component_design\` and proceed to the next step

**Key Activities in Step 1**:
- Use MCP tool \`compoder component-list\` to get available components
- Extract component name, description, and required libraries/components
- Generate component design specification in markdown format

### Step 2: Generate Component Code

**Trigger condition**: \`current_step = 2\` and \`component_design\` is not empty

**Actions**:

1. Completely read the \`step2.md\` file content from this Skill directory (\`.claude/skills/${folderName}/step2.md\`)
2. Apply this rule to generate the component code
3. Save the generated code to appropriate files in the directory confirmed by the user

**Key Activities in Step 2**:
- Use MCP tool \`compoder component-detail\` to get component API documentation
- Ask user to confirm target directory before creating files
- Create actual component files using write tool (not XML format)
- Implement component with Tailwind CSS styling and responsive design

## Important Notes

1. Step files will be loaded as needed, and will not load all step contents at once
2. Each step file will be read completely, without omitting content due to line number limitations
3. State variables are continuously maintained throughout the workflow to ensure coherence between steps
4. After each step is completed, print the value of \`current_step\` and inform the user what the next step will be

## Usage

When using this Skill, provide the component requirements or design draft first, and the system will automatically start executing from step 1.

---

**Skill File Structure**:
- \`SKILL.md\` (this file) - Main orchestration controller
- \`step1.md\` - Component design phase instructions (read on demand)
- \`step2.md\` - Component implementation phase instructions (read on demand)
`
}

/**
 * 生成 index.mdc 入口文件
 */
export function generateIndexMdc(
  codegenName: string,
  folderName: string,
): string {
  return `---
description: compoder ${codegenName}
globs:
alwaysApply: false
---

# ${codegenName} Component Generation Orchestration Rules

When the user references this rule document, the system will execute component generation according to the following workflow:

1. Design component specification (Component Design)
2. Generate component code based on the design

Note:

- The required rule files must be read completely step by step, and only after one step is completed can the next rule file be read
- Each step should be executed sequentially to ensure proper component generation

## State Management and Execution Mechanism

The system will maintain the following state variables:

- \`current_step\`: The current execution step (1-2)
- \`user_requirements\`: User's component requirements or design draft
- \`component_design\`: Component design information from step 1
- \`component_code\`: Generated component code from step 2

### Complete Rule File Reading Mechanism

Since rule files may exceed the single reading limit, the system will:

1. **Use multi-segment reading**: Read each rule file completely in multiple times, without omitting any content
2. **Verify completeness**: Ensure the rule file has been completely read by checking the end of file content
3. **Maintain context**: Maintain the overall context and coherence of the rule file when reading multiple segments

## Step Details

### Step 1: Design Component Specification

**Trigger condition**: \`current_step = 1\` and the user has provided component requirements

**Actions**:

1. Completely read the \`./.cursor/rules/compoder/${folderName}/step1.md\` file content
2. Apply this rule to design the component and extract required information
3. Update \`component_design\` and proceed to the next step

### Step 2: Generate Component Code

**Trigger condition**: \`current_step = 2\` and \`component_design\` is not empty

**Actions**:

1. Completely read the \`./.cursor/rules/compoder/${folderName}/step2.md\` file content
2. Apply this rule to generate the component code
3. Save the generated code to appropriate files in the current directory

## Notes

1. The system will load rule files as needed, and will not load all rule contents at once
2. Each rule file will be read completely, without omitting content due to line number limitations
3. State variables are continuously maintained throughout the workflow to ensure coherence between steps
4. After each step is completed, the value of current_step should be printed, and the user should be informed of what the next step will be

---

When using this rule, please provide the component requirements or design draft first, and the system will automatically start executing from step 1.
`
}

/**
 * 获取 private components 描述
 */
function getPrivateDocsDescription(rules: CodegenRule[]): string {
  const privateComponentsRule = rules.find(
    rule => rule.type === "private-components",
  )
  const publicComponentsRule = rules.find(
    rule => rule.type === "public-components",
  )

  const docs = privateComponentsRule?.docs
  const publicLibraryComponents = publicComponentsRule?.dataSet

  const hasPublicLibrary =
    !!publicLibraryComponents &&
    Array.isArray(publicLibraryComponents) &&
    publicLibraryComponents.length > 0
  const hasPrivateLibrary = !!docs && Object.keys(docs).length > 0

  if (!hasPrivateLibrary && !hasPublicLibrary) {
    return ""
  }

  if (!hasPrivateLibrary) {
    return hasPublicLibrary
      ? `- All components in ${publicLibraryComponents.join(", ")}`
      : ""
  }

  const templates: string[] = []

  if (hasPublicLibrary) {
    templates.push(`- All components in ${publicLibraryComponents.join(", ")}`)
  }

  for (const namespace in docs) {
    if (docs.hasOwnProperty(namespace)) {
      const components = docs[namespace]
      let componentDescriptions = ""

      for (const key in components) {
        if (components.hasOwnProperty(key)) {
          const component = components[key]
          componentDescriptions += `  {componentName: ${key}, description: ${component.description}}\n`
        }
      }

      const template = `- Components in "${namespace}", below are descriptions of "${namespace}" components (can only use component names listed below)
---------------------
Important: You can only use the component name keys listed below in the response, do not use other component names. Do not be influenced by component names in the user-provided code, as the components in the user's code are likely already included in the components listed below.
${componentDescriptions.trim()}
---------------------`
      templates.push(template.trim())
    }
  }

  return templates.join("\n\n")
}

/**
 * 生成 step1.md - 组件设计阶段
 */
export function generateStep1Md(
  rules: CodegenRule[],
  codegenName: string,
): string {
  const componentsDescription = getPrivateDocsDescription(rules)
  const hasComponentLibraries = !!componentsDescription

  const promptParts = hasComponentLibraries
    ? {
        goal: 'Extract the "basic component materials", component name, and description information needed to develop business components from business requirements and design drafts.',
        constraints: `To get the complete list of available basic components, you should use the MCP tool \`compoder component-list\` with the codegen name(${codegenName}). This will provide you with all available components in each library.
`,
        responseFormat: `## Component Design

**Component Name**: [Component name]

**Component Description**: [Component description]

**Required Libraries and Components**:

### [Library Name 1]
- Component 1
- Component 2
- ...

**Usage Description**: [Describe how each component will be used in a table or list format]

### [Library Name 2]
- Component 1
- Component 2
- ...

**Usage Description**: [Describe how each component will be used]`,
        workflowStep2:
          "2. Extract required materials from [Constraints] basic component materials for developing business components. Use the MCP \`component-list\` tool to get the complete list of available components.",
      }
    : {
        goal: "Extract component name and description information needed to develop business components from business requirements and design drafts.",
        constraints: `- Extract the component name and description information from the business requirements and design drafts.
- Analyze the design draft to understand the business functionality needed.

Please note: You should provide a clear markdown response with the component information.`,
        responseFormat: `## Component Design

**Component Name**: [Component name]

**Component Description**: [Component description that clearly explains the purpose and functionality]`,
        workflowStep2:
          "2. Analyze the business requirements and design drafts to identify needed business components and their functions",
      }

  const workflowSteps = `1. Accept user's business requirements or design draft images
${promptParts.workflowStep2}
3. Generate and return the markdown response in the specified format`

  return `# Component Design Phase

## Role
You are a senior frontend engineer who excels at developing business components.

## Goal
${promptParts.goal}

## Constraints
${promptParts.constraints}

## Response Format
You must respond with a markdown structure in the following format:
\`\`\`md
${promptParts.responseFormat}
\`\`\`
## Workflow
${workflowSteps}

## MCP Tools Available
${
  hasComponentLibraries
    ? `
- \`component-list\`: Use this tool to get the complete list of available components for the selected codegen
  - Parameters: \`codegenName\` (string)
  - Returns: A markdown document listing all available components organized by library
`
    : ""
}

---

Please analyze the user's requirements and provide the component design information following the format above.
`
}

/**
 * 生成 step2.md - 组件实现阶段
 */
export function generateStep2Md(
  rules: CodegenRule[],
  codegenName: string,
): string {
  const fileStructureRule = rules.find(rule => rule.type === "file-structure")
  const stylesRule = rules.find(rule => rule.type === "styles")
  const publicComponentsRule = rules.find(
    rule => rule.type === "public-components",
  )
  const privateComponentsRule = rules.find(
    rule => rule.type === "private-components",
  )
  const attentionRulesRule = rules.find(rule => rule.type === "attention-rules")

  const IMPORTANT_NOTE = `**CRITICAL: File Creation Instructions**

You MUST create actual files directly using the file writing tools. Do NOT:
- Use XML format (e.g., <ComponentArtifact>, <ComponentFile>)
- Use code blocks with file paths as documentation
- Output code in any wrapper format

BEFORE creating any files:
1. **Ask the user to confirm the target directory** where files should be saved
2. Wait for user confirmation before proceeding
3. Once confirmed, create each file separately using the write tool

When creating component files:
1. Use the write tool to create each file with its full path
2. Use appropriate file extensions (.tsx, .ts, .css, etc.)
3. Include complete, production-ready code in each file
4. Ensure all imports and exports are correct
5. Follow the file structure specified below

`

  const defaultFileStructure = `${IMPORTANT_NOTE}Create component files with the following structure:

**Main Component File** (\`ComponentName.tsx\`):
- Main component implementation
- Split into multiple files if exceeds 500 lines
- Export the component

**App Entry File** (\`App.tsx\`):
- Import the component
- Define mock data/props
- Render the component with mock data

**Helper Functions** (\`helpers.ts\`, optional):
- Utility functions used by the component

**Type Definitions** (\`interface.ts\`):
- TypeScript interfaces for component props
- All API-interacting data must be defined as props:
  - initialData for component initialization
  - onChange, onSave, onDelete etc. for data modifications
`

  const defaultStyles = `Use tailwindcss to write styles`

  const defaultAdditionalRules = `- Ensure component is fully responsive across all device sizes
- Implement proper accessibility (ARIA) attributes
- Add comprehensive PropTypes or TypeScript interfaces
- Include error handling for all async operations
- Optimize rendering performance where possible`

  const outputSpecification = fileStructureRule?.prompt
    ? `${IMPORTANT_NOTE}${fileStructureRule.prompt}`
    : defaultFileStructure

  const styleSpecification = stylesRule?.prompt ?? defaultStyles

  const openSourceComponents =
    publicComponentsRule?.dataSet && publicComponentsRule.dataSet.length > 0
      ? `**Open Source Components**
- You can use components from ${publicComponentsRule.dataSet.join(", ")}
- Use the latest stable version of APIs`
      : ""

  const privateComponents = privateComponentsRule?.docs
    ? `**Private Components**
- Must strictly follow the API defined in the documentation
- Using undocumented private component APIs is prohibited
- Use the MCP tool \`compoder component-detail\` to get detailed API documentation for specific components
  - Parameters: \`codegenName(${codegenName})\`, \`libraryName\`, \`componentNames\` (array)
  - Returns: Detailed API documentation for the requested components`
    : ""

  const additionalRules = attentionRulesRule?.prompt ?? defaultAdditionalRules

  const hasComponentGuidelines = openSourceComponents || privateComponents
  const componentGuidelinesHeader = hasComponentGuidelines
    ? "## Component Usage Guidelines\n"
    : ""

  const componentGuidelines = hasComponentGuidelines
    ? `${componentGuidelinesHeader}${openSourceComponents}${
        openSourceComponents && privateComponents ? "\n\n" : ""
      }${privateComponents}`
    : ""

  return `# Component Implementation Phase

## Role
You are a senior frontend engineer focused on business component development.

## Goal
Generate business component code based on user requirements and the component design from Step 1.

## Output Specification
${outputSpecification}

## Style Specification
${styleSpecification}

${componentGuidelines}

## Additional Rules
${additionalRules}

## MCP Tools Available

- \`compoder component-detail\`: Use this tool to get detailed API documentation for specific components
  - Parameters: 
    - \`codegenName\` (string): The name of the codegen
    - \`libraryName\` (string): The library name (e.g., "pageui", "shadcn")
    - \`componentNames\` (array): Array of component names to get details for
  - Returns: Detailed API documentation including props, usage examples, and best practices

## Workflow

1. Review the component design from Step 1
2. If the design includes private components, use the \`compoder component-detail\` MCP tool to get their API documentation
3. **IMPORTANT: Ask the user to confirm the target directory** for saving files
   - Present the current working directory as the default option
   - Wait for user's explicit confirmation or alternative directory path
   - Do NOT proceed to file creation without confirmation
4. Once directory is confirmed, create the component files using the write tool
5. Implement the component logic according to the requirements
6. Ensure all style and additional rules are followed
7. Create an App.tsx entry file with mock data to demonstrate the component

---

**Remember**: 
- Do NOT use XML format or any wrapper syntax
- ALWAYS ask for directory confirmation before creating files
- Create actual files directly using the write tool

Please implement the component based on the design from Step 1.
`
}
