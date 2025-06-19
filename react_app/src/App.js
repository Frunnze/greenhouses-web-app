import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom'
import './App.css'
import Dashboard from './components/dashboard/Dashboard';
import Home from './components/Home';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/greenhouse/:id" element={<Dashboard />}/>
      </Routes>
    </Router>
  );
}

export default App;