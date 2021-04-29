import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorCatch from "./error/index";

ReactDOM.render(
  <React.StrictMode>
    <ErrorCatch
      app="react-catch"
      user="cxyuns"
      max={1}
      onCatch={(errors) => {
        console.log('报错咯！',errors);
        // 上报异常信息到后端，动态创建标签方式
        new Image().src = `http://localhost:3000/log/report?info=${JSON.stringify(errors)}`
      }}
    >
      <App />
    </ErrorCatch>
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
