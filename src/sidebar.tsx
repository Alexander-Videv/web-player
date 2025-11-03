import React from 'react'
import './sidebar.css'
import profilePic from './logo.png'
import { Link } from 'react-router-dom';

function Sidebar() {

  const username = sessionStorage.getItem("user");

  return (
    <div className='sidebar'>
      <img id='profile-picture' src={profilePic} alt='Missing' />
      <ul>
        <li><Link to='/home'>Home</Link></li>
        <li><Link to={`/discover`}>Discover</Link></li>
        <li><Link to={`/${username}/playlists`}>Playlists</Link></li>
        <li><Link to='/upload'>Upload</Link></li>
      </ul>
    </div >
  );
}

export default Sidebar 