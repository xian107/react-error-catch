'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.selfError = "自身边界错误";
        _this.stableMessage = [_this.selfError];
        _this.beforeFilter = function (error) {
            var judge = _this.stableMessage.concat(_this.props.filters ? _this.props.filters : []);
            if (error.msg) {
                return judge.includes(error.msg);
            }
            return true;
        };
        _this.filter = function (error) {
            // filter by user define
            if (_this.beforeFilter(error)) {
                console.log("filterError：", error);
                return;
            }
            // filter the mutiple items
            var localtime = error.localtime, caught_event = error.caught_event;
            var label = localtime + "-" + caught_event;
            _this.state.maps.set(label, error);
            // post by max
            // 1 means post immediately
            var max = _this.props.max || 1;
            if (_this.state.maps && _this.state.maps.size >= max) {
                _this.catchBack();
            }
        };
        _this.catchBack = function () {
            try {
                var report = {
                    level: "error",
                    app: _this.props.app || 'cxyuns_app',
                    errors: Array.from(_this.state.maps.values()),
                    localinfo: __assign(__assign(__assign({ user: _this.props.user || 'cxyuns_user' }, (_this.props.token ? { token: _this.props.token } : {})), (_this.props.language ? { user_language: _this.props.language } : {})), { ua: window.navigator.userAgent, is_cookie: window.navigator.cookieEnabled ? 1 : 0, cookie: document.cookie || '', screenHeight: window.screen.availHeight, screenWidth: window.screen.availWidth })
                };
                if (_this.props.onCatch) {
                    _this.props.onCatch(report);
                }
                // after callback the maps, then clear
                _this.state.maps.clear();
            }
            catch (error) {
                console.log(_this.selfError, error);
            }
        };
        _this.postError = function (error) {
            if (process.env.NODE_ENV === 'development') {
                console.table(error);
            }
            // filter same errors, it will remian the last one
            _this.filter(error);
        };
        _this.catchError = function (error) {
            error.stopPropagation();
            try {
                var colno = error.colno, lineno = error.lineno, filename = error.filename, type = error.type, isTrusted = error.isTrusted, message = error.message;
                var obj = {
                    caught_event: 'onerror',
                    msg: message,
                    localtime: _this.getTime(),
                    stack: "Error: at " + filename + " " + lineno + ":" + colno,
                    event_type: type,
                    is_trusted: isTrusted ? 1 : 0,
                    err_href: window.location.href,
                };
                _this.postError(obj);
            }
            catch (error) {
                console.log(_this.selfError, error);
            }
        };
        _this.catchRejectEvent = function (error) {
            try {
                var type = error.type, reason = error.reason, isTrusted = error.isTrusted;
                var msg = void 0, stack = void 0;
                if (typeof reason === "string") {
                    msg = reason;
                }
                if (Object.prototype.toString.call(reason) === '[object Error]') {
                    msg = reason.message;
                    stack = reason.stack;
                }
                var obj = {
                    caught_event: 'onunhandledrejection',
                    msg: msg,
                    localtime: _this.getTime(),
                    stack: stack,
                    event_type: type,
                    is_trusted: isTrusted ? 1 : 0,
                    err_href: window.location.href,
                };
                _this.postError(obj);
            }
            catch (error) {
                console.log(_this.selfError, error);
            }
            error.stopPropagation();
        };
        _this.getTime = function () {
            var date = new Date();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            return (date.getFullYear() + "-" + month + "-" + strDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
        };
        _this.state = {
            hasError: false,
            maps: new Map(),
        };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function () {
        // react错误边界静态方法，返回值相当于调用setState()
        return {
            hasError: true,
        };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, info) {
        try {
            var obj = {
                caught_event: 'componentDidCatch',
                msg: error.message,
                localtime: this.getTime(),
                stack: info.componentStack,
                event_type: error.name,
                is_trusted: 1,
                err_href: window.location.href,
            };
            this.postError(obj);
        }
        catch (error) {
            console.log(this.selfError, error);
        }
    };
    ErrorBoundary.prototype.componentDidMount = function () {
        // event catch
        window.addEventListener('error', this.catchError, true);
        // async code
        window.addEventListener('unhandledrejection', this.catchRejectEvent, true);
    };
    ErrorBoundary.prototype.componentWillUnmount = function () {
        window.removeEventListener('error', this.catchError, true);
        window.removeEventListener('unhandledrejection', this.catchRejectEvent, true);
    };
    ErrorBoundary.prototype.render = function () {
        var errorRender = this.props.errorRender;
        if (this.state.hasError) {
            return errorRender ? errorRender : React.createElement("h1", null, "Something went wrong.");
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(React.Component));

module.exports = ErrorBoundary;
