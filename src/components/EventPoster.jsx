import PropTypes from 'prop-types';

const EventPoster = ({ poster, title, size = 'medium' }) => {
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
        rounded-3xl overflow-hidden shadow-lg
        hover:bg-white/20 hover:shadow-2xl hover:scale-[1.02]
        transition-all duration-300
        group relative
      `}
    >
      {poster && (
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

EventPoster.propTypes = {
  poster: PropTypes.string,
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'wide']),
};

export default EventPoster;
