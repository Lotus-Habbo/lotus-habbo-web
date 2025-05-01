import { useEffect, useRef, useState } from "react";
import styles from "./Player.module.css";

export default function Player() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [selectedStation, setSelectedStation] = useState("https://sv13.hdradios.net:7770/stream");

  const stations = [
    //{ label: "HabboNight", value: "https://sv13.hdradios.net:7770/stream" },
    { label: "Habblindados", value: "https://stream1.svrdedicado.org/8058/stream" },
    //{ label: "LightHabbo", value: "https://stream.truesecurity.com.br/8048/stream" },
    { label: "Kihabbo", value: "https://s10.w3bserver.com/radio/8160/stream" },
  ];

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = selectedStation;
    audio.volume = volume;
  }, [selectedStation]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const changeVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleStationChange = (e) => {
    const wasPlaying = !audioRef.current.paused;
    setSelectedStation(e.target.value);
    if (wasPlaying) {
      setTimeout(() => {
        audioRef.current.play();
        setIsPlaying(true);
      }, 100);
    } else {
      setIsPlaying(false);
    }
  };

  const reloadStream = () => {
    const audio = audioRef.current;
    const currentSrc = audio.src;
    audio.pause();
    audio.src = '';
    audio.load();
    audio.src = currentSrc;
    audio.load();
    if (isPlaying) {
      audio.play();
    }
  };

  return (
    <div className={styles.playerContainer}>
      <div className={styles.controls}>
        <button onClick={togglePlay} className={styles.controlButton}>
          <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
        </button>
        <button onClick={reloadStream} className={styles.reloadButton} title="Recarregar stream">
          <i className="fas fa-rotate-right"></i>
        </button>
        <div className={styles.volumeControlWrapper}>
          <div className={styles.volumeSliderContainer}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={changeVolume}
              className={styles.volumeSlider}
            />
          </div>
        </div>
      </div>
      <select
        className={styles.select}
        value={selectedStation}
        onChange={handleStationChange}
      >
        {stations.map((station) => (
          <option key={station.value} value={station.value}>
            {station.label}
          </option>
        ))}
      </select>
      <audio ref={audioRef} preload="none" />
    </div>
  );
}
