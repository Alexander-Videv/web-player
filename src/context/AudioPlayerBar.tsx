import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useAudioPlayer } from "./AudioPlayerCtx";
import './AudioPlayerBar.css'


export default function AudioPlayerBar() {
    const API = process.env.REACT_APP_API_URL;
    const { currentSong, nextSong, prevSong } = useAudioPlayer();

    return (
        <div className="bar-wrap">
            <div className="bar">
                <p className="song-name">{currentSong ?
                    currentSong.title + (currentSong.artist ? " ~ " + currentSong.artist : '')
                    : "No audio"}</p>
                <div className="player">
                    <AudioPlayer
                        src={`${API}${currentSong ? currentSong.file_path : undefined}`}
                        onClickNext={nextSong}
                        onClickPrevious={prevSong}
                        onEnded={nextSong}
                        showSkipControls
                        showJumpControls={false}
                        layout="horizontal"
                        autoPlay
                    />
                </div>
            </div>
        </div>
    );
}
