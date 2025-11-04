import React, { useState } from 'react'
import './upload.css'
import Sidebar from '../sidebar'

const API = "https://web-player-backend.onrender.com";

async function uploadSong(username: string, file: File, songTitle: string, artist: string, coverArtLink?: string) {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("file", file);
    formData.append("title", songTitle);
    formData.append("artist", artist)

    if (coverArtLink)
        formData.append("cover_art", coverArtLink);

    const res = await fetch(`${API}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await res.json();
    console.log(data);
}


function Upload() {

    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState<string>('');
    const [artist, setArtist] = useState<string>('');
    const [coverArtLink, setCoverArtLink] = useState<string>('');
    const username = sessionStorage.getItem("user");

    const handleUpload = async () => {
        console.log(file, username)
        if (file && username && title && artist) {
            await uploadSong(username, file, title, artist, coverArtLink);
            alert("Song uploaded!");
        } else
            alert("Missing fields");
    };

    return (
        <div className='wrap'>
            <Sidebar />
            <div className='content'>
                <h1>Upload here</h1>
                <div className='form-data'>
                    <div className='file'>
                        <label htmlFor='file-upload' className="custom-file-upload">
                            {
                                file ? file.name : "Choose File"
                            }
                        </label>
                        {/* <p className='filename'> : {file?.name}</p> */}
                    </div>
                    <div className='inputs'>
                        <input type="file" id='file-upload' onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        <h2>Title:</h2>
                        <input type='text' placeholder='Song title...'
                            onChange={(e) => setTitle(e.target.value)} />
                        <h2>Artist:</h2>
                        <input type='text' placeholder='Song artist...'
                            onChange={(e) => setArtist(e.target.value)} />
                    </div>
                    <div className='upload-buttons'>
                        <h2>Cover art link:</h2>
                        <input type='text' placeholder='Cover art link...(500px x 500px)'
                            onChange={(e) => setCoverArtLink(e.target.value)} />
                        <button onClick={handleUpload}>Upload</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Upload