import { useState } from 'react';
import BentoGrid from '../components/BentoGrid';
import EventCard from '../components/EventCard';
import Header from '../components/Header';

const EventsPage = () => {
  // Sample events data - You can replace this with your actual 15 events
  const events = [
    {
      id: 1,
      title: "LA MIRA",
      description: "The ultimate treasure hunt experience across the campus. Solve puzzles, crack codes, and discover hidden clues.",
      image: "/path/to/lamira-image.jpg",
      date: "December 12, 2025",
      time: "10:00 AM - 2:00 PM",
      venue: "Campus Wide",
      category: "Adventure",
      size: "large"
    },
    {
      id: 2,
      title: "Code Combat",
      description: "Competitive programming event where the best coders battle it out.",
      image: "/path/to/codecombat-image.jpg",
      date: "December 13, 2025",
      time: "9:00 AM - 5:00 PM",
      venue: "Computer Lab A",
      category: "Technical",
      size: "medium"
    },
    {
      id: 3,
      title: "Tech Quiz",
      description: "Test your knowledge across various domains of technology.",
      image: "/path/to/quiz-image.jpg",
      date: "December 12, 2025",
      time: "2:00 PM - 4:00 PM",
      venue: "Auditorium",
      category: "Quiz",
      size: "small"
    },
    {
      id: 4,
      title: "Robo Wars",
      description: "Build and battle with your robots in an epic showdown.",
      image: "/path/to/robowars-image.jpg",
      date: "December 14, 2025",
      time: "11:00 AM - 5:00 PM",
      venue: "Arena Ground",
      category: "Robotics",
      size: "wide"
    },
    {
      id: 5,
      title: "Hackathon",
      description: "24-hour coding marathon to build innovative solutions.",
      image: "/path/to/hackathon-image.jpg",
      date: "December 13-14, 2025",
      time: "6:00 PM onwards",
      venue: "Innovation Lab",
      category: "Technical",
      size: "large"
    },
    {
      id: 6,
      title: "Web Design",
      description: "Showcase your creativity in designing stunning websites.",
      image: "/path/to/webdesign-image.jpg",
      date: "December 12, 2025",
      time: "10:00 AM - 1:00 PM",
      venue: "Design Studio",
      category: "Creative",
      size: "medium"
    },
    {
      id: 7,
      title: "Circuit Debugging",
      description: "Find and fix errors in complex circuit designs.",
      image: "/path/to/circuit-image.jpg",
      date: "December 13, 2025",
      time: "3:00 PM - 5:00 PM",
      venue: "Electronics Lab",
      category: "Technical",
      size: "small"
    },
    {
      id: 8,
      title: "Tech Talk",
      description: "Inspiring talks from industry experts and innovators.",
      image: "/path/to/techtalk-image.jpg",
      date: "December 12, 2025",
      time: "5:00 PM - 7:00 PM",
      venue: "Main Auditorium",
      category: "Workshop",
      size: "wide"
    },
    {
      id: 9,
      title: "Gaming Arena",
      description: "Competitive gaming tournaments with exciting prizes.",
      image: "/path/to/gaming-image.jpg",
      date: "December 13, 2025",
      time: "12:00 PM - 6:00 PM",
      venue: "Gaming Zone",
      category: "Gaming",
      size: "medium"
    },
  ];

  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    // You can navigate to a detailed event page or show a modal
    console.log('Event clicked:', event);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <Header />

      {/* Page Header */}
      <div className="pt-32 pb-12 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          TechSrijan Events
        </h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          December 12-14, 2025 • Explore our exciting lineup of technical and cultural events
        </p>
      </div>

      {/* Events Grid */}
      <BentoGrid className="max-w-7xl mx-auto pb-20">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            description={event.description}
            image={event.image}
            date={event.date}
            time={event.time}
            venue={event.venue}
            category={event.category}
            size={event.size}
            onClick={() => handleEventClick(event)}
          />
        ))}
      </BentoGrid>
    </div>
  );
};

export default EventsPage;
