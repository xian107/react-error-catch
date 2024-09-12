import React from 'react'
export interface ErrorInfo {
  localtime: number | string // window.performance.timeOrigin 时间戳
  msg?: string // 错误信息localtime
  stack?: string  // 文件路径
  caught_event?: string // 捕获事件 "onerror" | "onunhandledrejection" | "componentDidCatch"
  event_type?: string // event.type 事件类型
  is_trusted?: number // event.isTrusted 事件触发来源
  err_href?: string // 出错地址
}

export interface Localinfo {
  user?: string // 触发错误的用户
  user_language?: string // 访问网站语言
  token?: string // 用户token
  ua?: string
  is_cookie?: number // 错误信息
  cookie?: string
  screen_height?: number | string
  screen_width?: number | string
}
export interface ReportError {
  level: string // 错误级别，可取值：warning / notice / error / info
  app: string // 应用名称
  errors?: ErrorInfo[] // 错误信息，至少传一个
  localinfo?: Localinfo // 本地机器或者浏览器信息
}
export interface Error {
  name: string;
  message: string;
  stack?: string;
}

export interface ErrorCatcherState {
  hasError: boolean
  maps: Map<string, any>
}
export interface ErrorCatcherProps extends React.Props<ErrorCatcher> {
  errorRender?: React.ReactNode //当 捕获到组件渲染错误时，降级渲染样式
  user?: string // 谁触发了错误。默认：bcyg_user
  token?: string // 用户token
  language?: string // 访问网站语言
  app?: string // 触发错误的应用，默认：bcyg_app
  onCatch?: (error: ReportError) => any  // 当满足设置条件时的错误捕获回调
  max?: number // 当捕获到的错误超过设置max值时，触发onCatch事件。默认：1
  filters?: string[] // 定义需要过滤的错误
  children?: React.ReactNode;
}

declare class ErrorCatcher extends React.Component<ErrorCatcherProps, ErrorCatcherState> { }

export default ErrorCatcher