import PropTypes from 'prop-types';

const EventLeaderboardButton = ({ leaderboardLink, size = 'small' }) => {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-2',
    large: 'col-span-2 row-span-2',
    wide: 'col-span-2 row-span-1',
  };

  return (
    <a
      href={leaderboardLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        ${sizeClasses[size]}
        group/btn relative backdrop-blur-lg bg-white/10 border border-white/20
        rounded-3xl shadow-lg overflow-hidden
        transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-[1.02] hover:shadow-2xl
        flex items-center justify-center
        cursor-pointer
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex flex-col items-center justify-center gap-3 p-6">
        <span className="text-5xl">🏆</span>
        <span className="text-white font-bold text-xl text-center">MITS Leaderboard</span>
      </div>
    </a>
  );
};

EventLeaderboardButton.propTypes = {
  leaderboardLink: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'wide']),
};

export default EventLeaderboardButton;
