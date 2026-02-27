/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useRef, useState } from "react";
import React from 'react'
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();


const PlayerContextProvider = (props) => {

  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [playerStatus, setPlayerStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0
    },
    totalTime: {
      second: 0,
      minute: 0
    }
  })

  const playWithId = async (id) => {
    await setTrack(songsData[id]);
    await audioRef.current.play();
    setPlayerStatus(true);
  }

  const play = () => {
    audioRef.current.play();
    setPlayerStatus(true);
  }

  const pause = () => {
    audioRef.current.pause();
    setPlayerStatus(false);
  }

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (!audio.duration) return;

      seekBar.current.style.width =
        (audio.currentTime / audio.duration) * 100 + "%";

      setTime({
        currentTime: {
          second: Math.floor(audio.currentTime % 60),
          minute: Math.floor(audio.currentTime / 60),
        },
        totalTime: {
          second: Math.floor(audio.duration % 60),
          minute: Math.floor(audio.duration / 60),
        },
      });
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioRef]);

  const seekSong = (e) => {
    audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration)
  }


  const previous = async () => {
    if (track.id > 0) {
      await setTrack(songsData[track.id - 1]);
      await audioRef.current.play();
      setPlayerStatus(true);
    }
  }

  const next = async () => {
    if (track.id < songsData.length - 1) {
      await setTrack(songsData[track.id + 1]);
      await audioRef.current.play();
      setPlayerStatus(true);
    }
  }


  const contextvalue = {
    audioRef,
    seekBar,
    seekBg,
    track, setTrack,
    playerStatus, setPlayerStatus,
    time, setTime,
    play, pause,
    seekSong,
    previous, next,
    playWithId
  }

  return (
    <PlayerContext.Provider value={contextvalue} >
      {props.children}
    </PlayerContext.Provider >
  )
}

export default PlayerContextProvider;