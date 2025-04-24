import avatar from '../assets/avatarweb.png';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';


function Navbar({ darkMode, setDarkMode }) {

  return (
    <>
      <nav className="p-4 bg-gray-100 dark:bg-gray-800 shadow-md flex justify-between items-center">
        <div className='flex flex-row gap-2 items-center'>
          <img
            src={avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full shadow-md object-cover"
          />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Sergiotify</h1>
        </div>
        {/* Theme Toggle */}
        <div className="flex items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </button>

        </div>
      </nav>
    </>
  );
}

export default Navbar;