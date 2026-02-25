import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
}

const TactileButton: React.FC<TactileButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  ...props 
}) => {
  const baseStyles = "relative font-bold uppercase tracking-wider transition-all duration-75 active:translate-y-[4px] rounded-2xl border-b-[6px] text-black";
  
  const variants = {
    primary: "bg-[#58cc02] border-[#46a302] text-white hover:brightness-110 active:border-b-0",
    secondary: "bg-[#1cb0f6] border-[#1899d6] text-white hover:brightness-110 active:border-b-0",
    danger: "bg-[#ff4b4b] border-[#d33131] text-white hover:brightness-110 active:border-b-0",
    ghost: "bg-transparent border-2 border-gray-200 text-gray-400 hover:bg-gray-100 active:border-b-2 active:translate-y-0"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "w-full py-4 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default TactileButton;