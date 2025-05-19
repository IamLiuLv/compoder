Feature: LoginForm 用户登录入口
As a 前端工程师
I want to通过 Github 登录快速进入系统
So that可以体验 AI 组件代码生成服务

Background:
Given 用户在登录页
And 页面展示 Compoder Logo、标题、副标题和技术栈图标

Scenario: 正常点击 Github 登录按钮
When 用户点击"Sign in with Github"按钮
Then 应触发 onGithubSignIn 回调
And 按钮进入 loading 态
And 按钮禁用

Acceptance Criteria:
_ 按钮点击后 loading 态正确显示
_ onGithubSignIn 必须被调用
_ loading 时按钮不可再次点击

Scenario: loading 态下用户重复点击
Given 按钮处于 loading 态
When 用户尝试再次点击"Sign in with Github"按钮
Then 不应触发 onGithubSignIn 回调
And 按钮保持 loading 态

Acceptance Criteria:
_ loading 态下按钮禁用
_ 不会重复触发 onGithubSignIn

Scenario: 组件无回调函数
Given 未传递 onGithubSignIn 或 onSubmit
When 用户点击"Sign in with Github"按钮
Then 不应报错
And 页面正常渲染

Acceptance Criteria:
_ 未传递回调时组件不报错
_ UI 正常显示