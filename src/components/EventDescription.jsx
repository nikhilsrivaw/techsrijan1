import PropTypes from 'prop-types';

const EventDescription = ({ description, size = 'medium' }) => {
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
        About the Event
      </h2>
      <p className="text-white/70 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};

EventDescription.propTypes = {
  description: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'wide']),
};

export default EventDescription;
