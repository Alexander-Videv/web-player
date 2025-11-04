import { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import './discover.css'
import { useAudioPlayer } from "../context/AudioPlayerCtx";
import Playlists, { addToPlaylist } from "../Playlists/playlists"


interface Playlist {
    id: number;
    userId: number;
    name: string;
    description?: string;
    coverArt?: string;

}

function Discover() {

    const API = "https://web-player-backend.onrender.com";

    const username = sessionStorage.getItem("user");

    const [songs, setSongs] = useState<any[]>([]);
    const { currentSong, setPlaylist, playSong } = useAudioPlayer();

    const [searchText, setSearch] = useState("");

    const [myPlaylists, setMyPlaylists] = useState<any[]>([]);
    const [selectedPlaylist, setSelected] = useState<Playlist>()

    const filteredItems = songs.filter((song) =>
        song.title.toLowerCase().includes(searchText.toLowerCase()) ||
        song.artist?.toLowerCase().includes(searchText.toLocaleLowerCase())
    );


    useEffect(() => {
        fetch(`${API}/songs`)
            .then(res => res.json())
            .then(data => setSongs(data))
            .catch(err => console.log(err))
    })

    useEffect(() => {
        if (!username) return;

        fetch(`${API}/users/${username}/playlists`)
            .then(res => res.json())
            .then(data => {
                console.log('raw playlists response', data);
                setMyPlaylists(data)
            })
            .catch(err => console.error(err))
    }, [username]);

    const mySongs = myPlaylists.find((pl) => pl.name === "My Songs");

    const [activePopup, setActivePopup] = useState<number | null>(null);

    function togglePopup(index: number) {
        setActivePopup(prev => (prev === index ? null : index));
    }

    return (
        <div className="wrap">
            <Sidebar />
            <div className="content">
                <h1>Discover <span>Here</span></h1>
                <div className="discover">
                    <div className="search-bar">
                        <input type="text" placeholder={"Search here..."}
                            onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    <div className="discover-data">
                        {filteredItems.map((s, i) =>
                            <div key={i} className="song-cell">
                                {
                                    s.cover_art ?
                                        <div className="song-info">
                                            <img className="song-art"
                                                onClick={() => playSong(s)}
                                                src={s.cover_art}></img>
                                            <div className="song-text">
                                                <h2 className="song-title"
                                                    onClick={() => playSong(s)}
                                                    style={{
                                                        color: currentSong?.id === s.id ? "#689d6a" : "#ebdbb2"
                                                    }}>{s.title}</h2>
                                                <h3 className="song-artist">{s.artist}</h3>
                                            </div>
                                        </div>
                                        :
                                        <span>
                                            <h2 className="song-title"
                                                onClick={() => playSong(s)}
                                                style={{
                                                    color: currentSong?.id === s.id ? "#689d6a" : "#ebdbb2"
                                                }}>{s.title}</h2>
                                            <h3 className="song-artist">{s.artist}</h3>
                                        </span>
                                }
                                <div className="buttons">
                                    <button onClick={() => playSong(s)}>Play</button>
                                    <span>
                                        <button onClick={() => {
                                            addToPlaylist(s.id, mySongs.id);
                                            alert(`Added ${s.title} to ${mySongs.name}`)
                                        }}>Save</button>
                                        <button onClick={() => togglePopup(i)}>Save to</button>

                                        {activePopup === i && (
                                            <div className="playlists-popup">
                                                <select
                                                    value={selectedPlaylist?.id ?? ""}
                                                    onChange={(e) => {
                                                        const pl = myPlaylists.find(p => p.name === e.target.value);
                                                        setSelected(pl || null);
                                                    }}
                                                >
                                                    <option value="" disabled hidden>
                                                        Select a playlist
                                                    </option>
                                                    {myPlaylists
                                                        .filter(pl => pl.name !== "My Songs")
                                                        .map((pl, j) => (
                                                            <option key={j} value={pl.name}>
                                                                {pl.name}
                                                            </option>
                                                        ))}
                                                </select>
                                                {selectedPlaylist ? <button
                                                    onClick={() => {
                                                        addToPlaylist(s.id, selectedPlaylist.id)
                                                        togglePopup(i);
                                                    }}>Save to {selectedPlaylist.name}
                                                </button> : null}
                                            </div>)}
                                    </span>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Discover