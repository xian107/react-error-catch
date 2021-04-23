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
        console.log('catched')
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
|max|当捕获到的错误超过设置 max 值时，触发 `onCatch` 事件|number|1|
|delay|设置错误上报周期|number|60000|
|filters|定义需要过滤的错误|string[]|-|
|onCatch|当满足设置条件时的错误捕获回调|(error: ErrorInfo[]) => any|-|

