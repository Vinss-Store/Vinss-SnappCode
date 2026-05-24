import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/music.mp3";

function AudioPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showVol, setShowVol] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
    audio.loop = true;
    return () => { audio.pause(); };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  function togglePlay() {
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />

      {/* Volume slider */}
      {showVol && (
        <div className="audio-volume-wrap">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--text-dim)", flexShrink: 0 }}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
          <input
            type="range"
            min="0" max="1" step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="audio-volume-slider"
          />
        </div>
      )}

      {/* Volume button */}
      <button
        className="audio-btn"
        onClick={() => setShowVol(v => !v)}
        title="Volume"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>}
          {volume === 0 && <><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></>}
        </svg>
      </button>

      {/* Play / Pause button */}
      <button
        className={`audio-btn audio-play-btn ${playing ? "audio-playing" : ""}`}
        onClick={togglePlay}
        title={playing ? "Pause" : "Play musik"}
      >
        {playing ? (
          <span className="audio-bars">
            <span /><span /><span /><span />
          </span>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        )}
      </button>
    </div>
  );
}

export default AudioPlayer;
