import { useEffect, useRef, useState } from 'react';

const videoUrl = `${import.meta.env.BASE_URL}Public/video/bitcoin-spinning-static-hand.mp4`;
const posterUrl = `${import.meta.env.BASE_URL}Public/image/bitcoin-spinning-static-hand-poster.webp`;

export default function HeroVideo({ active, reduceMotion }) {
  const videoRef = useRef(null);
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;
    if (!active || reduceMotion || userPaused) {
      video.pause();
      return;
    }
    video.muted = true;
    video.play().catch(() => {
      // The poster and play button remain available if autoplay is blocked.
    });
    return () => video.pause();
  }, [active, reduceMotion, userPaused, failed]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      setUserPaused(true);
      video.pause();
    } else {
      setUserPaused(false);
      video.play().catch(() => {});
    }
  }

  return (
    <div className="portfolio-hero__media">
      <div
        className="portfolio-hero__video-stage"
        role="img"
        aria-label="A stationary robotic hand presents a spinning Bitcoin coin on a black background."
      >
        <img
          className="portfolio-hero__poster"
          src={posterUrl}
          width="1600"
          height="900"
          alt=""
          fetchPriority="high"
          decoding="async"
          aria-hidden="true"
        />
        {!reduceMotion && !failed && (
          <video
            ref={videoRef}
            id="hero-bitcoin-video"
            className={`portfolio-hero__video${ready ? ' is-ready' : ''}`}
            src={videoUrl}
            poster={posterUrl}
            width="1920"
            height="1080"
            autoPlay={active && !userPaused}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            aria-hidden="true"
            onPlaying={() => { setReady(true); setPlaying(true); }}
            onPause={() => setPlaying(false)}
            onError={() => { setFailed(true); setPlaying(false); }}
          />
        )}
      </div>
      {!reduceMotion && !failed && (
        <button
          className="portfolio-hero__playback"
          type="button"
          aria-label={playing ? 'Pause hero animation' : 'Play hero animation'}
          aria-controls="hero-bitcoin-video"
          onClick={togglePlayback}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            {playing ? <path d="M4 3h3v10H4zm5 0h3v10H9z" /> : <path d="m5 3 8 5-8 5z" />}
          </svg>
          <span>{playing ? 'Pause animation' : 'Play animation'}</span>
        </button>
      )}
    </div>
  );
}
