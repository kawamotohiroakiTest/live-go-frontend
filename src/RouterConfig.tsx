// src/RouterConfig.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';

const RouterConfig = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        {/* 他のルートもここに追加 */}
      </Routes>
    </Router>
  );
};

export default RouterConfig;
