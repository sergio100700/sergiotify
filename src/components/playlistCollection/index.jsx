import React, { useEffect, useState } from 'react';
import Playlist from '../playlists';
import { motion } from 'framer-motion';

const PlaylistCollection = ({ playlists, onSelectPlaylist }) => {
  const [selectedSong, setSelectedSong] = useState();
  const [selectedPlaylist, setSelectedPlaylist] = useState();

  useEffect(() => {
    onSelectPlaylist(selectedPlaylist);
  }, [selectedPlaylist]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {playlists.map((playlist) => (
        <motion.div
          key={playlist.id}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all"
        >
          <Playlist
            title={playlist.title}
            selected={selectedSong}
            songs={playlist.songs}
            handleClickPlaylist={() => setSelectedPlaylist(playlist)}
            onSelectedSong={(s) => setSelectedSong(s)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default PlaylistCollection;
