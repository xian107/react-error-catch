import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const hah = ()=>{
    console.log("走你走你走你走你走你走你走你走你走你走你走你走你走你走你")
    throw new Error("test")
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={hah}>点击我throw error</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
