import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
// import logo from './logo.svg';
 import './App.css';
import BaseRouter from './routes';

function App() {
  return (
    <div className="App">
       <Router  basename="/exibition-new">
          <BaseRouter/>
        </Router>
    </div>
  );
}

export default App;
