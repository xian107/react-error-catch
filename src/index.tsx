import React, { cloneElement } from "react";
import { ErrorCatcherProps, ErrorCatcherState, ErrorInfo, ReportError } from "../index.d";
class ErrorBoundary extends React.Component<ErrorCatcherProps, ErrorCatcherState> {
  timeout: any = null;
  selfError = "自身边界错误";
  // 过滤日志
  stableMessage = [
    this.selfError,
    "ResizeObserver loop limit exceeded",
    "Uncaught ReferenceError: viewWillAppear is not defined",
    "Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.",
    "ResizeObserver loop completed with undelivered notifications.",
  ];
  constructor(props: ErrorCatcherProps) {
    super(props);
    this.state = {
      hasError: false,
      maps: new Map(),
    };
  }

  static getDerivedStateFromError() {
    // react错误边界静态方法，返回值相当于调用setState()
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    try {
      const obj = {
        caught_event: "componentDidCatch",
        msg: error.message,
        localtime: Date.now(),
        stack: info.componentStack,
        event_type: error.name,
        is_trusted: 1,
        err_href: window.location.href,
      };
      this.postError(obj);
    } catch (error) {
      console.log(this.selfError + "componentDidCatch", error);
    }
  }

  componentDidMount() {
    // event catch
    window.addEventListener("error", this.catchError, true);
    // async code
    window.addEventListener("unhandledrejection", this.catchRejectEvent, true);
  }

  componentWillUnmount() {
    window.removeEventListener("error", this.catchError, true);
    window.removeEventListener("unhandledrejection", this.catchRejectEvent, true);
  }

  beforeFilter = (error: ErrorInfo): boolean => {
    const judge = this.stableMessage.concat(this.props.filters ? this.props.filters : []);
    if (error.msg && error.msg.includes("failed.n(timeout:")) {
      return true;
    }
    if (error.msg) {
      return judge.includes(error.msg);
    }
    return true;
  };

  filter = (error: ErrorInfo) => {
    // filter by user define
    if (this.beforeFilter(error)) {
      return;
    }
    if (process.env.NODE_ENV === "development") {
      console.table(error);
    }

    // filter the mutiple items
    const { localtime, caught_event } = error;
    const label = `${Math.floor((localtime as number) / 1000)}-${caught_event}`;
    error.localtime = this._getTime(localtime);
    this.state.maps.set(label, error);
    this.debounce();
  };
  // 过滤1秒内连续抛出同一错误
  debounce = () => {
    try {
      if (this.timeout !== null) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        const max = this.props.max || 1;
        if (this.state.maps && this.state.maps.size >= max) {
          this.catchBack();
        }
      }, 1000);
    } catch (error) {
      console.log(this.selfError + "debounce", error);
    }
  };

  catchBack = () => {
    try {
      const report: ReportError = {
        level: "error",
        app: this.props.app || "bcyg_app",
        errors: Array.from(this.state.maps.values()),
        localinfo: {
          user: this.props.user || "bcyg_user",
          ...(this.props.token ? { token: this.props.token } : {}),
          ...(this.props.language ? { user_language: this.props.language } : {}),
          ua: window.navigator.userAgent,
          is_cookie: window.navigator.cookieEnabled ? 1 : 0,
          cookie: document.cookie || "",
          screen_height: window.screen.availHeight,
          screen_width: window.screen.availWidth,
        },
      };
      if (this.props.onCatch) {
        this.props.onCatch(report);
      }
      // after callback the maps, then clear
      this.state.maps.clear();
    } catch (error) {
      console.log(this.selfError + "catchBack", error);
    }
  };

  postError = (error: ErrorInfo) => {
    // filter same errors, it will remian the last one
    this.filter(error);
  };

  catchError = (error: ErrorEvent) => {
    error.stopPropagation();
    try {
      const { colno, lineno, filename, type, isTrusted, message } = error;
      const obj = {
        caught_event: "onerror",
        msg: message,
        localtime: Date.now(),
        stack: `Error: at ${filename} ${lineno}:${colno}`,
        event_type: type,
        is_trusted: isTrusted ? 1 : 0,
        err_href: window.location.href,
      };
      this.postError(obj);
    } catch (error) {
      console.log(this.selfError + "catchError", error);
    }
  };

  catchRejectEvent = (error: PromiseRejectionEvent) => {
    try {
      const { type, reason, isTrusted } = error;
      let msg, stack;
      if (typeof reason === "string") {
        msg = reason;
      }
      if (Object.prototype.toString.call(reason) === "[object Error]") {
        msg = reason.message;
        stack = JSON.stringify(reason);
        if (stack === "{}") {
          stack = reason.stack;
        }
        // 防止上报日志时接口出错，造成死循环
        if (reason.config && reason.config.url && reason.config.url.includes("/log/web/report")) {
          return;
        }
      }
      const obj = {
        caught_event: "onunhandledrejection",
        msg,
        localtime: Date.now(),
        stack,
        event_type: type,
        is_trusted: isTrusted ? 1 : 0,
        err_href: window.location.href,
      };
      this.postError(obj);
    } catch (error) {
      console.log(this.selfError + "catchRejectEvent", error);
    }
    error.stopPropagation();
  };

  _zero(s: any) {
    return s < 10 ? "0" + s : s;
  }
  _getTime = (localtime: number | string) => {
    let date = new Date(localtime);
    let month: string | number = this._zero(1 + date.getMonth());
    return (
      date.getFullYear() +
      "-" +
      month +
      "-" +
      this._zero(date.getDate()) +
      " " +
      this._zero(date.getHours()) +
      ":" +
      this._zero(date.getMinutes()) +
      ":" +
      this._zero(date.getSeconds())
    );
  };

  render() {
    const { errorComponent, children } = this.props;

    return cloneElement(errorComponent, {
      hasError: this.state.hasError,
      children,
    });
  }
}

export default ErrorBoundary;
