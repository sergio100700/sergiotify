import React from 'react';

const Title = ({ children, className = '' }) => {
    return (
        <h1 className={`text-4xl font-bold text-gray-800 dark:text-gray-400 ${className}`}>
            {children}
        </h1>
    );
};

export default Title;