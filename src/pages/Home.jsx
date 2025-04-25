import { motion } from 'framer-motion';
import { FaMusic } from "react-icons/fa";
import audio1 from '../assets/audio/audio1.mp3';
import audio2 from '../assets/audio/audio2.mp3';
import flute from '../assets/audio/flute.mp3';
import AudioPlayer from '../components/audioPlayer';
import Playlist from '../components/playlists';
import { useState } from 'react';
import PlaylistCollection from '../components/playlistCollection';

const songs = [
  { url: audio2, name: "Nature song very long file name to test scrolling" },
  { url: audio1, name: "Virtual" },
]

const playlist = {
  id: 1,
  title: "Top 2 Spain",
  songs: songs
}
const playlist2 = {
  id: 1,
  title: "Top 2 Spain",
  songs: [
    { url: flute, name: "Flute songs" },
  ]
}

function Home() {

  const [selectedPlaylist, setSelectedPlaylist] = useState();
  const [selected, setSelected] = useState();

  return (
    <motion.section
      className="px-6 py-10 max-w-4xl mx-auto text-gray-800 dark:text-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center gap-8">
        <div className='flex flex-col items-center md:items-start'>
          <AudioPlayer playlist={selectedPlaylist} selected={selected} onPlay={(s) => {
            setSelected(s)
          }} />
        </div>
        
        <PlaylistCollection playlists={[playlist, playlist2]} onSelectPlaylist={(p)=>{
          setSelectedPlaylist(p)
        }} />
      </div>
    </motion.section>
  );
}

export default Home;