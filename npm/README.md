### 捕获 React 异常
|异常类型|同步方法|异步方法|资源加载|Promise|async/await|
|:---|:---|:---|:---|:---|:---|
|try/catch|√||||√|
|onerror|√|√||||
|error事件监听|√|√|√|||
|unhandledrejection事件监听||||√|√|

错误表现类型：

- 渲染错误，渲染阶段发生异常，比如某个组件没有引入就使用
- 引用错误，即引入某个资源文件时发生错误，这个往往在编译过程中能够捕获到。在这里我们讨论异步引入的情况
- 事件处理，即渲染没问题，但是在在调用其触发事件时发生错误，比如 JSON.parse(JSON.parse("error"))，这类错误可以细分为用户手动触发和脚本触发，可以参考 Error.isTrusted 属性进行理解
- 异步代码，比如 promise.reject("error")

### 使用

执行 `npm install react-error-catch` 或者 `yarn add react-error-catch` 来进行引入

紧接着在项目内：

```javascript
import ErrorCatch from 'react-error-catch'

const App = () => {
  return (
  <ErrorCatch
      app="react-catch"
      user="cxyuns"
      delay={5000}
      max={1}
      filters={[]}
      onCatch={(errors) => {
        console.log('报错咯')
      }}
    >
      <Main />
    </ErrorCatch>)
}

export default App
```

## Props

|属性|描述|类型|默认值|
|:---|:---|:---|:---|
|errorRender|当捕获到组件渲染错误时，降级渲染样式|React.ReactNode|\<h1>Something went wrong.\</h1>|
|user|谁触发了错误|"unkonwn user"||
|app|触发错误的 app|string|"unkonwn app"|
|token|触发错误的 token|string|-|
|language|访问网站语言 language|string|-|
|max|当捕获到的错误超过设置 max 值时，触发 `onCatch` 事件|number|1|
|filters|定义需要过滤的错误|string[]|-|
|onCatch|当满足设置条件时的错误捕获回调|(error: ErrorInfo[]) => any|-|

