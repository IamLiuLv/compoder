Feature: Logo 组件
As a 前端开发者
I want to 在页面中灵活展示品牌 Logo
So that 可以根据不同场景自定义 Logo 的尺寸和样式

Background:
Given 我已经引入了 Logo 组件
And 组件支持自定义 width、height 和 className 属性

Scenario: 默认渲染 Logo
When 我不传递任何 props 渲染 Logo 组件
Then 应该渲染一个 200x200 的 SVG Logo
And SVG 路径和渐变色正常显示

Acceptance Criteria:
_ 默认宽高为 200x200
_ SVG 路径和渐变色渲染无误

Scenario: 自定义尺寸渲染 Logo
Given 我设置 width 为 100，height 为 100
When 渲染 Logo 组件
Then 应该渲染一个 100x100 的 SVG Logo

Acceptance Criteria:
_ 支持任意正整数宽高
_ SVG 尺寸与 props 匹配

Scenario: 自定义 className
Given 我传递 className 为 "custom-logo"
When 渲染 Logo 组件
Then SVG 元素应包含该 className

Acceptance Criteria:
_ className 正确传递到 SVG 元素
_ 支持 tailwindcss 或自定义样式类

Scenario Outline: 多种尺寸批量渲染
Given 我设置 width 为 <width>，height 为 <height>
When 渲染 Logo 组件
Then SVG 尺寸应为 <width>x<height>

Examples:
| width | height |
| 50    | 50     |
| 150   | 80     |
| 300   | 300    |