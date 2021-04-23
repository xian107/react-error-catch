import React from 'react'

export interface ErrorInfo {
  app?: string // 应用名称
  user?: string // 触发错误的用户
  token?:string // 用户token
  caughtEvent?: string // 捕获事件 "onerror" | "onunhandledrejection" | "componentDidCatch"
  message?: string // 错误信息
  timeOrigin?: number | string // window.performance.timeOrigin 时间戳
  stack?: string  // 文件路径
  type?: string // event.type 事件类型
  isTrusted?: boolean // event.isTrusted 事件触发来源
  cookieEnabled?: boolean  // 是否启用 cookie
  cookie?: string
  userAgent?: string
  href?: string // 出错地址
  screenHeight?: number | string
  screenWidth?: number | string
}

export interface Error {
  name: string;
  message: string;
  stack?: string;
}

export interface ErrorCatcherState {
  hasError: boolean
  maps: Map<string,any>,
  timer: any
}

export interface ErrorCatcherProps extends React.Props<ErrorCatcher> {
  errorRender?: React.ReactNode //当 捕获到组件渲染错误时，降级渲染样式
  user?: string // 谁触发了错误。默认：cxyuns_user
  token?: string // 用户token
  app?: string | number // 触发错误的应用，默认：cxyuns_app
  onCatch?: (error: ErrorInfo[]) => any // 当满足设置条件时的错误捕获回调
  max?: number // 当捕获到的错误超过设置max值时，触发onCatch事件。默认：1
  delay?: number // 设置错误上报周期，默认：60000
  filters?: string[] // 定义需要过滤的错误
}

declare class ErrorCatcher extends React.Component<ErrorCatcherProps, ErrorCatcherState> {}

export default ErrorCatcher