import PropTypes from 'prop-types';

const EventRules = ({ rules, size = 'medium' }) => {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-2',
    large: 'col-span-2 row-span-2',
    wide: 'col-span-2 row-span-1',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        backdrop-blur-lg bg-white/10 border border-white/20
        rounded-3xl p-8 shadow-lg
        hover:bg-white/20 hover:shadow-2xl
        transition-all duration-300
        flex flex-col
      `}
    >
      <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/20 pb-3">
        Rules & Guidelines
      </h2>
      <ul className="space-y-3">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start gap-3 text-white/70 text-sm">
            <span className="text-red-400 font-bold mt-1">•</span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

EventRules.propTypes = {
  rules: PropTypes.arrayOf(PropTypes.string).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'wide']),
};

export default EventRules;
