import Sidebar from "../sidebar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './playlists.css'
import { useAudioPlayer } from "../context/AudioPlayerCtx";

const API = process.env.REACT_APP_API_URL;


async function createPlaylist(name: string, username: string | undefined) {
    if (!username) return;

    const res = await fetch(`${API}/createplaylist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            playlistName: name,
            username: username,
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await res.json();
    console.log(data);

}

export async function addToPlaylist(songId: number, playlistId: number) {

    if (playlistId < 0) return;

    const res = await fetch(`${API}/addtoplaylist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            songId: songId,
            playlistId: playlistId,
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await res.json();
    console.log(data);
}

interface Song {
    id: number;
    title: string;
    artist: string;
    file_path: string;
}

interface Playlist {
    id: number;
    userId: number;
    name: string;
    description?: string;
    coverArt?: string;

}

function Playlists() {

    const { username } = useParams<{ username: string }>();
    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>({ id: 0, userId: 0, name: '' });
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentSongs, setSongs] = useState<Song[]>([]);
    const { currentSong, setPlaylist, playSong } = useAudioPlayer();

    const [selectedPlaylistId, setSelected] = useState(-1);


    const [createPlaylistName, setCreatedName] = useState('')

    const [newName, setNewName] = useState('');

    async function refreshPlaylists() {
        try {
            console.log(username)
            const res = await fetch(`${API}/users/${username}/playlists`);
            if (!res.ok) throw new Error("Failed to fetch playlists");
            const data = await res.json();
            setPlaylists(data);
        } catch (err) {
            console.error("Error fetching playlists:", err);
        }
    }

    async function removeFromPlaylist(playlistId: number, songId: number) {

        if (playlistId < 0) return;

        const res = await fetch(`${API}/playlists/${playlistId}/songs/${songId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Removal failed : ${errorText}`)
        }

        const data = await res.json();
        console.log(data);

        setSongs(prev => prev.filter(song => song.id !== songId));
    }

    async function deletePlaylist(pl: Playlist) {

        const res = await fetch(`${API}/deleteplaylist/${pl.id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Removal failed : ${errorText}`)
        }

        const data = await res.json();
        console.log(data);

        refreshPlaylists();
    }

    async function createPlaylist(name: string) {
        if (!username) return;

        const res = await fetch(`${API}/createplaylist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                playlistName: name,
                username: username,
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Upload failed: ${errorText}`);
        };

        const data = await res.json();
        console.log(data);

        refreshPlaylists();

        toggleNewPlaylist();
    }

    async function renamePlaylist(playlistid: number, newName: string) {

        if (!newName) return;

        const res = await fetch(`${API}/rename/${playlistid}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                newName: newName,
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Upload failed: ${errorText}`);
        };

        const data = await res.json();
        console.log(data);

        refreshPlaylists();
    }

    useEffect(() => {
        if (!username) return;

        fetch(`${API}/users/${username}/playlists`)
            .then(res => res.json())
            .then(data => setPlaylists(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [username]);

    useEffect(() => {
        if (!username) return;
        if (!currentPlaylist.name) return;

        fetch(`${API}/users/${username}/playlists/${currentPlaylist.name}`)
            .then(res => res.json())
            .then(data => {
                console.log('PLAYLIST', data);
                setSongs(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [username, currentPlaylist.name]);

    const [showPlaylist, setShow] = useState(false);

    function toggleNewPlaylist() {
        setShow(!showPlaylist);
        return;
    }

    const [showRename, setRename] = useState(false);

    function toggleRename() {
        setRename(!showRename);
        return;
    }

    // if (loading) return <p>Loading...</p>

    // console.log("Playlist here ->", currentPlaylist, "ID here ->", currentPlaylist.id);


    return (
        <div className="wrap">
            <Sidebar />
            <div className="content">
                <div className="headers">
                    <h1 className="">{username}'s Playlists</h1>
                    <h1 className="create-playlist" onClick={() => toggleNewPlaylist()}>Create New</h1>
                    {showPlaylist && <div className="new-playlist-dropdown" >
                        <p>Playlist name:</p>
                        <input type="text" placeholder="Give it a name..."
                            onChange={(e) => setCreatedName(e.target.value)} />
                        <button onClick={() => createPlaylist(createPlaylistName)}>Create</button>
                    </div>}
                </div>
                <div className="playlist-pill">
                    <ul className="list">
                        {playlists.map((pl, i) => (
                            <li onClick={() => setCurrentPlaylist(pl)}
                                tabIndex={0} key={i} className="list-items">
                                <p onClick={() => setCurrentPlaylist(pl)}
                                    className="playlist-name">{pl.name}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="playlist-data">
                        <div className="pl-headers">
                            <h2>{currentPlaylist.name}</h2>
                            {currentPlaylist.name && currentPlaylist.name !== "My Songs" ?
                                <span>
                                    <h2 className="rename"
                                        onClick={() => toggleRename()}>Rename</h2>
                                    {showRename && <div className="rename-popup" >
                                        <input type="text"
                                            placeholder="New name..."
                                            onChange={(e) => setNewName(e.target.value)} />
                                        <button
                                            onClick={() => renamePlaylist(currentPlaylist.id, newName)}
                                        >Change name</button>
                                    </div>}
                                    <h2 className="delete"
                                        onClick={() => deletePlaylist(currentPlaylist)}
                                    >Delete playlist</h2>
                                </span> : null}
                        </div>
                        {currentSongs.map((s, i) => (
                            <div key={i} className="song-wrapper">
                                <p onClick={() => {
                                    setPlaylist(currentSongs);
                                    playSong(s);
                                }}
                                    style={{
                                        color: currentSong?.id === s.id ? "#689d6a" : "#ebdbb2"
                                    }}>{s.title} {s.artist ? (" ~ " + s.artist) : null}</p>
                                <div className="add-to-pl">
                                    <p className="remove"
                                        onClick={() => removeFromPlaylist(currentPlaylist.id, s.id)}>Remove</p>
                                    <p onClick={() => addToPlaylist(s.id, selectedPlaylistId)}>
                                        Add to playlist
                                    </p>
                                    <select defaultChecked={true}>
                                        <option value="" disabled selected hidden>
                                            Select a playlist
                                        </option>
                                        {playlists.filter((pl, i) => (pl.name !== "My Songs"))
                                            .map((pl, i) => (
                                                <option onClick={() => setSelected(pl.id)}
                                                    value={pl.name} key={i}>
                                                    {pl.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Playlists