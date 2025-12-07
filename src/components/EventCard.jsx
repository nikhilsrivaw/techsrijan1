import PropTypes from 'prop-types';
import { useState } from 'react';

const EventCard = ({
  title,
  poster,
  description,
  rules,
  googleFormLink,
  leaderboardLink,
  category,
  size = 'medium',
}) => {
  const [showModal, setShowModal] = useState(false);

  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-2',
    large: 'col-span-2 row-span-2',
    wide: 'col-span-2 row-span-1',
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  return (
    <>
      {/* Event Card */}
      <div
        className={`
          ${sizeClasses[size]}
          backdrop-blur-lg bg-white/10 border border-white/20
          rounded-3xl overflow-hidden shadow-lg
          hover:bg-white/20 hover:shadow-2xl hover:scale-[1.02]
          transition-all duration-300 cursor-pointer
          group relative
        `}
        onClick={handleCardClick}
      >
        {/* Poster Image */}
        {poster && (
          <div className="w-full h-full relative">
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* Category Badge */}
              {category && (
                <span className="inline-block px-3 py-1 bg-white/20 border border-white/30 rounded-full text-xs font-semibold text-white/90 mb-3">
                  {category}
                </span>
              )}

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors duration-300">
                {title}
              </h3>

              {/* View Details */}
              <div className="flex items-center gap-2 text-white/80 group-hover:text-white group-hover:gap-3 transition-all duration-300">
                <span className="text-sm font-semibold">View Details</span>
                <span className="text-xl">→</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">{title}</h2>
                  {category && (
                    <span className="inline-block px-3 py-1 bg-white/20 border border-white/30 rounded-full text-xs font-semibold text-white/90">
                      {category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:rotate-90"
                >
                  <span className="text-2xl leading-none">×</span>
                </button>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Poster */}
                <div className="space-y-6">
                  {poster && (
                    <div className="rounded-2xl overflow-hidden">
                      <img
                        src={poster}
                        alt={title}
                        className="w-full h-auto object-cover max-h-[400px]"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4">
                    {googleFormLink && (
                      <a
                        href={googleFormLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn relative px-6 py-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl text-white font-semibold text-center overflow-hidden transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105 hover:shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center gap-2">
                          <span className="text-xl">📝</span>
                          <span>Register via Google Form</span>
                        </div>
                      </a>
                    )}
                    {leaderboardLink && (
                      <a
                        href={leaderboardLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn relative px-6 py-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl text-white font-semibold text-center overflow-hidden transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105 hover:shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center gap-2">
                          <span className="text-xl">🏆</span>
                          <span>MITS Leaderboard</span>
                        </div>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Column - Description & Rules */}
                <div className="space-y-6">
                  {/* Description Section */}
                  {description && (
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h3 className="text-xl font-semibold text-white/90 border-b border-white/20 pb-2 mb-3">
                        Description
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                        {description}
                      </p>
                    </div>
                  )}

                  {/* Rules Section */}
                  {rules && rules.length > 0 && (
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h3 className="text-xl font-semibold text-white/90 border-b border-white/20 pb-2 mb-3">
                        Rules & Guidelines
                      </h3>
                      <ul className="space-y-2">
                        {rules.map((rule, index) => (
                          <li key={index} className="flex items-start gap-2 text-white/70 text-sm">
                            <span className="text-red-400 mt-1">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

EventCard.propTypes = {
  title: PropTypes.string.isRequired,
  poster: PropTypes.string,
  description: PropTypes.string,
  rules: PropTypes.arrayOf(PropTypes.string),
  googleFormLink: PropTypes.string,
  leaderboardLink: PropTypes.string,
  category: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'wide']),
};

export default EventCard;
