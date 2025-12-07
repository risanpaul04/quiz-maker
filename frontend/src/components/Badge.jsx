import React from 'react';

/**
 * A reusable badge component displaying an icon and text.
 * @param {object} props - The component props.
 * @param {React.ComponentType} props.icon - A Lucide React icon component (e.g., CheckCircle, Tag).
 * @param {string} props.text - The text to display next to the icon.
 * @param {string} [props.bgColor='bg-blue-100'] - Background color class (Tailwind CSS).
 * @param {string} [props.textColor='text-blue-700'] - Text color class (Tailwind CSS).
 * @param {string} [props.className=''] - Additional classes for custom styling.
 */



const Badge = ({icon: Icon, text, bgColor = 'bg-blue-100', textColor = 'bg-blue-700'}) => {
    return (
        <div>
            <span
                className={`my-1 py-1 px-2 inline-flex items-center 
                gap-x-1 text-xs font-semibold ${bgColor} ${textColor}
                rounded-full`}
                >
                {Icon && 
                <Icon
                    className='w-4 h-4 mr-1 flex-shrink-0'
                />}
                {text}
            </span>
        </div>
    )
}

export default Badge;