import React from 'react';

const TypographyNormal = ({ children }) => {
    return (
        <p className="text-base text-gray-700 dark:text-gray-400 leading-relaxed">
            {children}
        </p>
    );
};

export default TypographyNormal;