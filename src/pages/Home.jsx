import { motion } from 'framer-motion';
import { FaMusic } from "react-icons/fa";
import avatar from '../assets/avatarweb.png';

function Home() {

  return (
    <motion.section
      className="px-6 py-10 max-w-4xl mx-auto text-gray-800 dark:text-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl font-bold mb-6 text-center">Sergiotify</h2>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <img
          src={avatar}
          alt="Avatar"
          className="w-40 h-40 rounded-full shadow-md object-cover"
        />
        <div className='flex flex-col items-center md:items-start'>
          <FaMusic />
        </div>
      </div>
    </motion.section>
  );
}

export default Home;