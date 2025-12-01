Feature: AppSidebarLayout 侧边栏布局组件
  作为一名用户
  我希望 AppSidebarLayout 能在不同场景下正确渲染
  以便获得良好的导航与交互体验

  Scenario: 菜单为空
    Given 用户已登录
    And 侧边栏菜单为空
    When 页面加载
    Then 应显示无菜单项的侧边栏
    And 主内容区正常展示

  Scenario: 仅有一个菜单项
    Given 用户已登录
    And 侧边栏仅有一个菜单项
    When 页面加载
    Then 应正确显示该唯一菜单项
    And 主内容区正常展示

  Scenario: 主题切换（深色模式）
    Given 用户已登录
    And 侧边栏有多个菜单项
    When 切换为深色主题
    Then 侧边栏与主内容区应以深色风格展示

  Scenario: 加载中状态
    Given 用户已登录
    And 侧边栏有多个菜单项
    When 页面处于加载中
    Then 主内容区应显示"加载中..."提示

  Scenario: 错误状态
    Given 用户已登录
    And 侧边栏有多个菜单项
    When 页面加载失败
    Then 主内容区应显示"加载失败，请重试。"提示 