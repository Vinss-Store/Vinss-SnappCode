import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/music.mp3";

function AudioPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [showVol, setShowVol] = useState(false);
  const [muted, setMuted] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
    audio.loop = true;

    // Coba autoplay langsung
    audio.play().then(() => {
      setPlaying(true);
      startedRef.current = true;
    }).catch(() => {
      // Diblokir browser — pasang listener, play saat user pertama kali interaksi
      const startOnInteraction = () => {
        if (startedRef.current) return;
        audio.play().then(() => {
          setPlaying(true);
          startedRef.current = true;
        }).catch(() => {});
        // Hapus semua listener setelah berhasil
        ["click", "keydown", "touchstart", "scroll"].forEach(e =>
          document.removeEventListener(e, startOnInteraction)
        );
      };
      ["click", "keydown", "touchstart", "scroll"].forEach(e =>
        document.addEventListener(e, startOnInteraction, { once: true })
      );
    });

    return () => { audio.pause(); };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  function toggleMute() {
    setMuted(m => !m);
  }

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />

      {/* Volume slider — muncul saat hover/klik ikon */}
      {showVol && (
        <div className="audio-volume-wrap">
          <input
            type="range"
            min="0" max="1" step="0.05"
            value={muted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setMuted(false);
            }}
            className="audio-volume-slider"
          />
        </div>
      )}

      {/* Satu tombol: mute/unmute + klik kanan untuk volume */}
      <button
        className={`audio-btn audio-mute-btn ${playing ? "audio-active" : ""}`}
        onClick={toggleMute}
        onMouseEnter={() => setShowVol(true)}
        onMouseLeave={() => setShowVol(false)}
        title={muted ? "Unmute" : "Mute"}
      >
        {muted || volume === 0 ? (
          // Muted icon
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        ) : playing ? (
          // Playing — animasi bars
          <span className="audio-bars">
            <span /><span /><span /><span />
          </span>
        ) : (
          // Sound icon
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        )}
      </button>
    </div>
  );
}

export default AudioPlayer;
