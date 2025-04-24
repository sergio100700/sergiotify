import React, { useState, useRef, useEffect } from "react";
import { Info, PauseCircle, PlayCircle, SkipNext, SkipPrevious, Stop, VolumeMute, VolumeUp } from "@mui/icons-material";
import "./styles.css";
import { Button } from "@mui/material";

const AudioPlayer = ({ playlist, onPlay, selected }) => {

  const [audio, setAudio] = useState();
  const [mediaCollection, setMediaCollection] = useState();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [volume, setVolume] = useState(1);
  const [audioIndex, setAudioIndex] = useState(0);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const volumeControlRef = useRef(null);
  const animationRef = useRef(undefined);
  const audioRef = useRef(null);
  const filenameContainerRef = useRef(null);
  const filenameTextRef = useRef(null);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);

  useEffect(() => {
    setMediaCollection(playlist)
    setAudio({ url: playlist[0]?.url, name: playlist[0]?.name })
  }, [playlist])

  useEffect(() => {
    setIsPlaying(false)
    setAudio({ url: selected?.url, name: selected?.name });
    const currentIndex = mediaCollection?.findIndex((_audio) => _audio.url === selected?.url);
    setAudioIndex(currentIndex)
  }, [selected, mediaCollection])

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!isDragging) {
        setProgress(audio.currentTime);
      }
      animationRef.current = requestAnimationFrame(updateProgress);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const calculateScroll = () => {
      const container = filenameContainerRef.current;
      const text = filenameTextRef.current;
      if (container && text) {
        const containerWidth = container.offsetWidth;
        const textWidth = text.scrollWidth;
        const distance = textWidth - containerWidth;
        if (distance > 0) {
          setScrollDistance(distance);
          // Definimos una velocidad (px/seg) y sumamos pausas (1s al inicio y 1s al final)
          const speed = 50; // px por segundo
          setAnimationDuration(distance / speed + 2);
        } else {
          setScrollDistance(0);
        }
      }
    };

    // Iniciar el bucle de animación
    animationRef.current = requestAnimationFrame(updateProgress);

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
      sourceNodeRef.current = audioCtxRef.current.createMediaElementSource(audio);
    }
    const audioCtx = audioCtxRef.current;
    const sourceNode = sourceNodeRef.current;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    if (sourceNode) {
      sourceNode.disconnect(); // En caso de reconectar, desconecta el anterior
      sourceNode.connect(analyser);
    }
    analyser.connect(audioCtx.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");

    const renderVisualizer = () => {
      requestAnimationFrame(renderVisualizer);
      analyser.getByteFrequencyData(dataArray);

      if (canvasCtx && canvas) {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = canvas.width / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i] / 2;
          canvasCtx.fillStyle = `rgb(${barHeight + 22},48,166)`;
          canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth;
        }
      }
    };

    // Event listeners adicionales
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("ended", () => setIsPlaying(false));
    setTimeout(calculateScroll, 100);
    window.addEventListener("resize", calculateScroll);
    renderVisualizer();
    togglePlayPause()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("play", () => setIsPlaying(true));
      audio.removeEventListener("pause", () => setIsPlaying(false));
      audio.removeEventListener("ended", () => setIsPlaying(false));
      window.removeEventListener("resize", calculateScroll);
    };
  }, [audio, isDragging]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (volumeControlRef.current && !volumeControlRef.current.contains(event.target)) {
        setShowVolumeControl(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // ¡Reanudar el AudioContext si está suspendido!
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.error("Error al reproducir:", e));
    }
  };


  const handleSeekStart = () => {
    setIsDragging(true);
  };

  const handleSeekEnd = () => {
    setIsDragging(false);
    // Sincronizar con el tiempo actual del audio después de soltar
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);

    // Actualizar el tiempo del audio en tiempo real
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const formatVolume = (vol) => {
    return `${Math.round(vol * 100)}%`;
  };



  const nextSong = async () => {
    if (!audio) return;
    const currentIndex = mediaCollection.findIndex((_audio) => _audio.url === audio.url);
    const nextIndex = (currentIndex ?? -1) + 1;
    const nextAudio = mediaCollection.find((_, index) => index === nextIndex);
    if (nextAudio) {
      setAudio(nextAudio);
      setIsPlaying(false);
      setProgress(0);
      setAudioIndex(nextIndex);
      onPlay(nextAudio);
    }
  };

  const previousSong = async () => {
    if (!audio) return;
    const currentIndex = mediaCollection.findIndex((_audio) => _audio.url === audio.url);
    const previousIndex = (currentIndex ?? 0) - 1;
    const previousAudio = mediaCollection[previousIndex];
    if (previousAudio) {
      setAudio(previousAudio);
      setIsPlaying(false);
      setProgress(0);
      setAudioIndex(previousIndex);
      onPlay(previousAudio)
    }
  };
  const handleChange = async (e) => {
    e.preventDefault();
    if (!audio) return;
    const currentIndex = mediaCollection.findIndex((_audio) => _audio.url === e.target.value);
    const current = currentIndex !== undefined ? mediaCollection[currentIndex] : undefined;
    if (current && currentIndex !== undefined) {
      setAudio(current);
      setIsPlaying(false);
      setProgress(0);
      setAudioIndex(currentIndex);
    }
  };

  return (
    <div className="audio-player-container">
      {audio && (
        <div className="audio-player-card">
          <div className="w-full flex justify-between px-3">
            <p className="audio-player-filename">{audio?.name}</p>
          </div>
          <audio ref={audioRef} src={audio.url ?? undefined} preload="auto" />
          <div className="audio-player-image">
            <canvas ref={canvasRef} className="audio-visualization"></canvas>
          </div>
          <div className="relative">
            <select
              value={audio.url}
              onChange={handleChange}
              className="opacity-0 appearance-none bg-transparent absolute inset-0 z-10 cursor-pointer"
            >
              {mediaCollection.map((option) => (
                <option
                  key={option.url}
                  value={option.url}
                  className="px-2 py-1 bg-white dark:bg-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700"
                >
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div className="audio-player-filename-container" ref={filenameContainerRef}>
            <p
              className="audio-player-filename"
              ref={filenameTextRef}
              style={
                scrollDistance
                  ? ({
                    "--scroll-distance": `${scrollDistance}px`,
                    animation: `scroll-text-custom ${animationDuration}s linear infinite`,
                  })
                  : {}
              }
            >
              {audio?.name}
            </p>
          </div>
          <div className="audio-player-progress-container">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              onMouseDown={handleSeekStart}
              onMouseUp={handleSeekEnd}
              onTouchStart={handleSeekStart}
              onTouchEnd={handleSeekEnd}
              step="any"
              className="audio-player-progress-bar"
            />
            <div className="audio-player-time-display">
              <span>{formatTime(progress)}</span>
              <span>{`${audioIndex + 1}/${mediaCollection.length || audioIndex + 1}`}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          <div className="audio-player-controls">
            {/* {onClose && (
              <Button onClick={onClose} className="!p-0">
                <Stop />
              </Button>
            )} */}
            <Button onClick={previousSong} className="!p-0">
              <SkipPrevious />
            </Button>
            <Button onClick={togglePlayPause} className="!p-0">
              {isPlaying ? <PauseCircle /> : <PlayCircle />}
            </Button>
            <Button onClick={nextSong} className="!p-0">
              <SkipNext />
            </Button>

            <div className="audio-player-volume-container" ref={volumeControlRef}>
              <Button onClick={() => setShowVolumeControl(!showVolumeControl)} className="!p-0">
                {volume === 0 ? <VolumeMute /> : <VolumeUp />}
              </Button>

              {showVolumeControl && (
                <div className="audio-player-volume-control">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="audio-player-volume-slider"
                  />
                  <span className="audio-player-volume-percentage">{formatVolume(volume)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
