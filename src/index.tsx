import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

import Home from './Home/home';
import Upload from './Upload/upload';
import Discover from './Discover/discover';
import Playlists from './Playlists/playlists'

import Login from './Login/Login'
import Register from './Register/register'
import { AudioPlayerProvider } from './context/AudioPlayerCtx';
import AudioPlayerBar from './context/AudioPlayerBar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function LoginWrapper() {
  let temp = sessionStorage.getItem("seen");
  let user = sessionStorage.getItem("user");
  if (!user)
    user = '';


  const [seen, setSeen] = useState(temp === "true");

  function togglePop() {
    sessionStorage.setItem("seen", "true");
    setSeen(true);
  };

  return (
    <div>
      {seen ? null : <Login toggle={togglePop} />}
    </div>
  )

}

function RegisterWrapper() {
  let temp = sessionStorage.getItem("seen");
  let user = sessionStorage.getItem("user");
  if (!user)
    user = '';


  const [seen, setSeen] = useState(temp === "true");

  function togglePop() {
    sessionStorage.setItem("seen", "true");
    setSeen(true);
  };

  return (
    <div>
      {seen ? null : <Register toggle={togglePop} />}
    </div>
  )

}


root.render(
  <React.StrictMode>
    <AudioPlayerProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to="/login" replace />} />
          <Route path='/home' element={<Home />} />
          <Route path='/upload' element={<Upload />} />
          <Route path='/discover' element={<Discover />} />
          <Route path={`:username/playlists`} element={<Playlists />} />
          <Route path='/login' element={<LoginWrapper />} />
          <Route path='/register' element={<RegisterWrapper />} />
        </Routes>
      </BrowserRouter>


      <AudioPlayerBar />

    </AudioPlayerProvider>
  </React.StrictMode >
);
