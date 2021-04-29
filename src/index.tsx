import React from 'react';
import { ErrorCatcherProps, ErrorCatcherState, ErrorInfo,ReportError } from '../index.d';
class ErrorBoundary extends React.Component<
  ErrorCatcherProps,
  ErrorCatcherState
> {
  selfError="自身边界错误"
  stableMessage = [this.selfError]
  constructor(props: ErrorCatcherProps) {
    super(props)
    this.state = {
      hasError: false,
      maps: new Map(),
    }
  }
 

  static getDerivedStateFromError() {
    // react错误边界静态方法，返回值相当于调用setState()
    return {
      hasError: true,
    }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    try {
      const obj = {
        caught_event: 'componentDidCatch',
        msg: error.message,
        localtime: Date.now(),
        stack: info.componentStack,
        event_type: error.name,
        is_trusted: 1,
        err_href: window.location.href,
      }
      this.postError(obj);
    } catch (error) {
      console.log(this.selfError,error)
    }
  }

  componentDidMount() {
    // event catch
    window.addEventListener('error', this.catchError, true)
    // async code
    window.addEventListener('unhandledrejection', this.catchRejectEvent, true)
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.catchError, true)
    window.removeEventListener(
      'unhandledrejection',
      this.catchRejectEvent,
      true
    )
  }

  beforeFilter = (error: ErrorInfo): boolean => {
    const judge = this.stableMessage.concat(this.props.filters ? this.props.filters : [])
    if (error.msg) {
      return judge.includes(error.msg)
    }
    return true
  }

  filter = (error: ErrorInfo) => {
    // filter by user define
    if (this.beforeFilter(error)) {
      console.log("filterError：",error);
      return
    }
    // filter the mutiple items
    const { localtime, caught_event } = error
    const label = `${localtime}-${caught_event}`
    error.localtime = this._getTime(localtime);
    this.state.maps.set(label, error)
    // post by max
    // 1 means post immediately
    const max = this.props.max || 1
    if (this.state.maps && this.state.maps.size >= max) {
      this.catchBack()
    }
  }

  catchBack = () => {
    try {
      const report:ReportError = {
        level: "error",
        app: this.props.app || 'cxyuns_app',
        errors: Array.from(this.state.maps.values()),
        localinfo:{
          user:this.props.user || 'cxyuns_user',
          ...(this.props.token ? {token: this.props.token} : {}),
          ...(this.props.language ? {user_language: this.props.language} : {}),
          ua: window.navigator.userAgent,
          is_cookie: window.navigator.cookieEnabled ? 1 : 0,
          cookie: document.cookie || '',
          screenHeight: window.screen.availHeight,
          screenWidth: window.screen.availWidth,
        }
      }
      if(this.props.onCatch){
        this.props.onCatch(report)
      }
      // after callback the maps, then clear
      this.state.maps.clear()
    } catch (error) {
      console.log(this.selfError,error)
    }
  }

  postError = (error: ErrorInfo) => {
    if (process.env.NODE_ENV === 'development') {
      console.table(error)
    }
    // filter same errors, it will remian the last one
    this.filter(error)
  }

  catchError = (error: ErrorEvent) => {
    error.stopPropagation()
    try {
      const {
        colno,
        lineno,
        filename,
        type,
        isTrusted,
        message,
      } = error
      const obj = {
        caught_event: 'onerror',
        msg: message,
        localtime: Date.now(),
        stack: `Error: at ${filename} ${lineno}:${colno}`,
        event_type: type,
        is_trusted: isTrusted ? 1: 0,
        err_href: window.location.href,
      }
      this.postError(obj)
    } catch (error) {
      console.log(this.selfError,error)
    }
  }

  catchRejectEvent = (error: PromiseRejectionEvent) => {
    try {
      const { type, reason, isTrusted } = error;
      let msg,stack;
      if(typeof reason === "string"){
        msg = reason;
      }
      if(Object.prototype.toString.call(reason) === '[object Error]'){
        msg = reason.message;
        stack = reason.stack;
      }
      const obj = {
        caught_event: 'onunhandledrejection',
        msg,
        localtime:Date.now(),
        stack: stack,
        event_type: type,
        is_trusted: isTrusted ? 1: 0,
        err_href: window.location.href,
      }
      this.postError(obj)
    } catch (error) {
      console.log(this.selfError,error)
    }
    error.stopPropagation()
  }

  _zero(s:string | number) {
    return s < 10 ? '0' + s: s;
  }
  _getTime=(localtime:number | string)=>{
    let date = new Date(localtime);
    let month:string | number = this._zero(1+date.getMonth());
    return (date.getFullYear() + "-" + month + "-" + this._zero(date.getDate()) + " " + this._zero(date.getHours()) + ":" + this._zero(date.getMinutes()) + ":" + this._zero(date.getSeconds()))
  }

  render() {
    const { errorRender } = this.props
    if (this.state.hasError) {
        return errorRender ? errorRender : <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}

export default ErrorBoundary
