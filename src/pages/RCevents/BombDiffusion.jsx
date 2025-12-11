import Header from '../../components/Header';
import BentoGrid from '../../components/BentoGrid';
import EventPoster from '../../components/EventPoster';
import EventDescription from '../../components/EventDescription';
import EventRules from '../../components/EventRules';
import EventRegistrationButton from '../../components/EventRegistrationButton';
import EventLeaderboardButton from '../../components/EventLeaderboardButton';
import { Link } from 'react-router-dom';
import poster from '../../assets/RC_poster/bomb.jpg';

const BombDiffusion = () => {
  // Single Event Data - Customize this for Bomb Diffusion
  const event = {
    title: "Bomb Diffusion",
    category: "Adventure",
    poster: poster, // Replace with your actual poster path
    description: "Step into the arena of Ultimate Defusal Showdown. Participants will face scenarios that test their technical skills. presence of mind, and problem-solving ability under pressure. This challenge pushes basic circuitry and composure to the limit. Do you have the focus and clarity to take on the role of an explosive specialist and succeed?",
    rules: [
      "Each team is limited to a maximum of 3 members.",
      "The competition consists of 2 rounds.",
      "Round 1:",
      "1. This round will be a quiz focusing on basic circuitry.","2. There will be 15 questions in total.","3. The top 10 teams with the highest scores will qualify for the second round.",

    ],
    googleFormLink: "https://forms.gle/ZFuAf8FaBUkm8K9x7",
    leaderboardLink: "https://mits.ac.in/leaderboard/lamira",
    eventDate: "December 12, 2025",
    eventTime: "10:00 AM - 2:00 PM",
    venue: "Campus Wide"
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />

        {/* Back Button */}
        <div className="pt-28 px-6 max-w-7xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white/80 hover:text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300"
          >
            <span className="text-xl">←</span>
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>

        {/* Event Content */}
        <div className="py-12 px-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full text-sm font-semibold text-white/90 mb-4">
              {event.category}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {event.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-6 text-white/70">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <span>{event.eventDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏰</span>
                <span>{event.eventTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📍</span>
                <span>{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <BentoGrid className="max-w-7xl mx-auto pb-20">
            {/* Poster - Large */}
            <EventPoster
              poster={event.poster}
              title={event.title}
              size="large"
            />

            {/* Description - Medium */}
            <EventDescription
              description={event.description}
              size="medium"
            />

            {/* Rules - Medium */}
            <EventRules
              rules={event.rules}
              size="medium"
            />

            {/* Registration Button - Small */}
            <EventRegistrationButton
              googleFormLink={event.googleFormLink}
              size="small"
            />

            {/* Leaderboard Button - Small */}
            <EventLeaderboardButton
              leaderboardLink={event.leaderboardLink}
              size="small"
            />
          </BentoGrid>
        </div>
      </div>
    </div>
  );
};

export default BombDiffusion;
