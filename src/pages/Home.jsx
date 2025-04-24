import { motion } from 'framer-motion';
import { FaMusic } from "react-icons/fa";
import audio1 from '../assets/audio/audio1.mp3';
import audio2 from '../assets/audio/audio2.mp3';
import AudioPlayer from '../components/audioPlayer';
import Playlist from '../components/playlists';
import { useState } from 'react';

const songs = [
  { url: audio2, name: "Nature song very long file name to test scrolling" },
  { url: audio1, name: "Virtual" },

]

function Home() {

  const [selected, setSelected] = useState();

  return (
    <motion.section
      className="px-6 py-10 max-w-4xl mx-auto text-gray-800 dark:text-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row items-center gap-8">

        <div className='flex flex-col items-center md:items-start'>
          <AudioPlayer playlist={songs} selected={selected} onPlay={(s) => {
            setSelected(s)
          }} />
        </div>
        <Playlist
          title={"Top 2 Spain"}
          selected={selected}
          songs={songs}
          onSelectedSong={(s) => {
            setSelected(s)
          }} />
      </div>
    </motion.section>
  );
}

export default Home;