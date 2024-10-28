import PropTypes from 'prop-types'; // For prop type validation

const Input = ({ Icon, ...props }) => {
  return (
    <div className="relative mb-6">
      {/* Conditionally render Icon to avoid errors if it's undefined */}
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="w-5 h-5 text-green-500" />
        </div>
      )}
      <input
        {...props} // Spread all other props
        className={`w-full pl-10 pr-3 py-2 bg-gray-700 bg-opacity-60 rounded-lg border border-gray-600 
        focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 
        transition duration-200 ${props.className || ''}`} // Maintain existing props + optional custom class
      />
    </div>
  );
};

// Adding prop types for validation
Input.propTypes = {
  Icon: PropTypes.elementType, // Icon should be a valid component
};

export default Input;
