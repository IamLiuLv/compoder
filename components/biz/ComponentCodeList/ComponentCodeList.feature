Feature: ComponentCodeList 组件
  作为一个组件使用者
  我想要浏览、点击、删除组件卡片
  以便于管理我的组件代码

  Scenario: 浏览组件列表
    Given 组件列表已渲染
    Then 应该能看到所有组件卡片的标题和描述

  Scenario: 点击组件卡片
    Given 组件列表已渲染
    When 我点击某个组件卡片
    Then 应该触发 onItemClick 回调

  Scenario: 删除组件卡片
    Given 组件列表已渲染
    When 我点击某个卡片右上角的删除按钮
    Then 应该弹出删除确认对话框
    When 我在对话框中点击"Delete"按钮
    Then 应该触发 onDeleteClick 回调，并关闭对话框