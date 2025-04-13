export const Button = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]";
  
  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600",
    secondary: "bg-green-500 text-white hover:bg-green-600",
    outline: "border-2 border-orange-500 text-orange-500 hover:bg-orange-50"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};