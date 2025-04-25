// Suggested code may be subject to a license. Learn more: ~LicenseLog:2642129483.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:117137141.
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const Playlist = ({ title, songs, onSelectedSong, handleClickPlaylist, selected }) => {
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    setSelectedSong(selected);
  }, [selected]);

  const handleSongClick = (song) => {
    setSelectedSong(song);
    onSelectedSong(song);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md ">
      <motion.div
        whileHover={{ scale: 1.2 }}
        className="flex items-center mb-2 hover:cursor-pointer origin-left"
        onClick={handleClickPlaylist}
      >
        <LibraryMusicIcon color="primary" fontSize="large" className="mr-2" />
        <h2 className="text-lg font-bold dark:text-white">{title}</h2>
      </motion.div>
      <ul className="list-none p-0">
        {songs.map((song) => (
          <li key={song.url} onClick={() => handleSongClick(song)} className="cursor-pointer flex items-center justify-between py-2 border-b border-gray-300 dark:border-gray-700"> <MusicNoteIcon className="mr-2 text-gray-600 dark:text-gray-400" />
            <span className="dark:text-white">{song.name}</span> <PlayArrowIcon color={selectedSong?.url === song.url ? "primary" : "disabled"} />
          </li>
        ))}
      </ul>
      {selectedSong && (
        <div>
          {/* Display details of selected song if needed */}
        </div>
      )}
    </div>
  );
};

export default Playlist;
