import { useState } from 'react';
import { Link } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';


function Navbar({ darkMode, setDarkMode }) {

  return (
    <>
      <nav className="p-4 bg-gray-100 dark:bg-gray-800 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Sergiotify</h1>
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