import { createContext, useContext, useState, ReactNode } from "react";

interface Song {
    id: number
    title: string;
    artist: string;
    file_path: string;
}

interface AudioPlayerContextType {
    currentSong: Song | null;
    playlist: Song[];
    setPlaylist: (songs: Song[]) => void;
    playSong: (song: Song) => void;
    nextSong: () => void;
    prevSong: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const playSong = (song: Song) => {
        setCurrentSong(song);
        const index = playlist.findIndex((s) => s.id === s.id);
        setCurrentIndex(index >= 0 ? index : 0);
    };

    const nextSong = () => {
        if (playlist.length > 0) {
            const nextIndex = (currentIndex + 1) % playlist.length;
            setCurrentIndex(nextIndex);
            setCurrentSong(playlist[nextIndex]);
        }
    };

    const prevSong = () => {
        if (playlist.length > 0) {
            const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
            setCurrentIndex(prevIndex);
            setCurrentSong(playlist[prevIndex]);
        }
    };

    return (
        <AudioPlayerContext.Provider
            value={{ currentSong, playlist, setPlaylist, playSong, nextSong, prevSong }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => {
    const ctx = useContext(AudioPlayerContext);
    if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
    return ctx;
};
