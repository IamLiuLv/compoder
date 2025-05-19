Feature: 加载指示器
作为一名用户
当内容加载时，我希望看到加载指示器
以便我知道系统正在工作

Background:
假设已引入 Loading 组件

Scenario: 显示默认加载指示器
当我以默认参数渲染 Loading 组件时
那么我应该看到一个默认尺寸的加载指示器
并且它不应为全屏

Acceptance Criteria:
_ 加载指示器可见
_ 加载指示器尺寸为默认
_ 非全屏

Scenario: 显示小号加载指示器
当我将 size 设为 "sm" 渲染 Loading 组件时
那么我应该看到一个小号加载指示器

Acceptance Criteria:
_ 加载指示器可见
_ 加载指示器尺寸为小

Scenario: 显示大号加载指示器
当我将 size 设为 "lg" 渲染 Loading 组件时
那么我应该看到一个大号加载指示器

Acceptance Criteria:
_ 加载指示器可见
_ 加载指示器尺寸为大

Scenario: 显示全屏加载指示器
当我将 fullscreen 设为 true 渲染 Loading 组件时
那么我应该看到一个居中的加载指示器
并且背景应为模糊半透明

Acceptance Criteria:
_ 加载指示器可见
_ 加载指示器居中
_ 存在全屏遮罩
_ 背景为模糊

Scenario: 显示自定义 className 的加载指示器
当我以自定义 className 渲染 Loading 组件时
那么加载指示器应带有自定义 class

Acceptance Criteria:
_ 加载指示器可见
_ 加载指示器带有自定义 class