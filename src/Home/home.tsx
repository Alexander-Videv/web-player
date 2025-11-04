import React, { useEffect, useState } from 'react';
import './home.css';
import Sidebar from '../sidebar'
import { Link } from 'react-router';
import { useAudioPlayer } from '../context/AudioPlayerCtx';

interface RecentSong {
    id: number;
    title: string;
    artist: string;
    file_path: string;
    cover_art: string;
    username: string;
}

function Home() {

    const API = "https://web-player-backend.onrender.com";

    const [playlists_data, setPlaylists] = useState<any[]>([]);
    let username = sessionStorage.getItem('user');

    const [recentUploads, setRecent] = useState<RecentSong[]>([])

    const { playSong } = useAudioPlayer();


    if (!username)
        username = '';


    useEffect(() => {
        fetch(`${API}/users/${username}/playlists`)
            .then(res => res.json())
            .then(data => setPlaylists(data))
            .catch(err => console.log(err));
    }, [username])

    useEffect(() => {
        async function fetchRecent() {
            const res = await fetch(`${API}/recent`);
            const data = await res.json();
            setRecent(data);
        }
        fetchRecent();
    }, []);


    console.log(playlists_data)


    return (
        <div className="wrap">
            <Sidebar />
            <div className='content'>
                <h1 id='hello'>Hello, {username}</h1>
                <div className='content-pill'>
                    <Link to={`/${username}/playlists`} className='content-header'>Playlists</Link>
                    <ul>
                        {playlists_data.map((pl, i) => (
                            <li key={i} className='playlist-item'>
                                {/* <img src='null' alt='Icon' className='playlist-image' /> */}
                                <p className='playlist-name'>{pl.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='content-pill'>
                    <Link to={`/discover`} className='content-header'>Uploaded recently</Link>
                    <ul className='songs'>
                        {
                            recentUploads.map((song, i) => (
                                <li key={i} className='song-item'>
                                    {song.cover_art ? <img className='song-art'
                                        height={500}
                                        width={500}
                                        src={song.cover_art}
                                        onClick={() => playSong(song)}></img>
                                        : null}
                                    <h3 className='song-title' onClick={() => playSong(song)}>{song.title}</h3>
                                    {song.artist ? <h4 className='song-artist'>{song.artist}</h4> : null}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div >
    );
}

export default Home;
