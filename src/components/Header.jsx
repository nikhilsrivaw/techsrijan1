import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LOGOTS } from "../assets";
import { registerTeam } from "../lib/laMiraService";

const Header = () => {
  const location = useLocation();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showEventsPopup, setShowEventsPopup] = useState(false);
  const [showRegistrationDropdown, setShowRegistrationDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  const [formData, setFormData] = useState({
    leaderName: '',
    leaderPhone: '',
    leaderDepartment: '',
    member1Name: '',
    member1Department: '',
    member2Name: '',
    member2Department: ''
  });

  const departments = [
    "BBA",
    "B.Pharma",
    "IT",
    "CSE",
    "Civil",
    "Mechanical",
    "ECE",
    "ECE-IoT",
    "Electrical"
  ];

  // Replace this with your actual payment QR code image path
  const paymentQRCode = "/path/to/your/qr-code.png";

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowRegistrationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onload = (e) => setScreenshotPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentScreenshot) {
      setMessage({
        type: 'error',
        text: 'Please upload payment screenshot'
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Submitting registration with data:', formData);
      const result = await registerTeam(formData, paymentScreenshot);
      console.log('Registration result:', result);

      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Registration successful! Your team has been registered for LA MIRA.'
        });

        // Reset form
        setFormData({
          leaderName: '',
          leaderPhone: '',
          leaderDepartment: '',
          member1Name: '',
          member1Department: '',
          member2Name: '',
          member2Department: ''
        });
        setPaymentScreenshot(null);
        setScreenshotPreview(null);

        // Close form after 3 seconds
        setTimeout(() => {
          setShowRegistrationForm(false);
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        console.error('Registration error:', result.error);
        setMessage({
          type: 'error',
          text: `Registration failed: ${result.error}`
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage({
        type: 'error',
        text: `An unexpected error occurred: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 px-4">
        <nav className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-full px-8 py-3 shadow-lg">
          <div className="flex items-center gap-6">
            <div className="flex items-center pr-4 border-r border-white/20">
              <img
                src={LOGOTS}
                alt="TechSrijan"
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEventsPopup(true)}
                className={`px-6 py-2 rounded-full font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                  location.pathname === "/" || location.pathname.startsWith("/BD") || location.pathname.startsWith("/NFS") || location.pathname.startsWith("/Tekken") || location.pathname.startsWith("/Sher") || location.pathname.startsWith("/Lamira") || location.pathname.startsWith("/Aero") || location.pathname.startsWith("/Science")
                    ? "bg-white/20 text-white shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Events
              </button>
              {/* <Link
                to="/leaderboard"
                className={`px-6 py-2 rounded-full font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                  location.pathname === "/leaderboard"
                    ? "bg-white/20 text-white shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Leaderboard
              </Link> */}
              <Link
                to="/glimpse"
                className={`px-6 py-2 rounded-full font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                  location.pathname === "/glimpse"
                    ? "bg-white/20 text-white shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Glimpse
              </Link>
              {/* <div className="relative dropdown-container">
                <button
                  onClick={() => setShowRegistrationDropdown(!showRegistrationDropdown)}
                  className="px-6 py-2 rounded-full font-semibold text-sm uppercase tracking-wide transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2"
                >
                  Registration
                  <span className={`transition-transform duration-300 ${showRegistrationDropdown ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {showRegistrationDropdown && (
                  <div className="absolute top-full mt-2 right-0 backdrop-blur-sm bg-black/10 border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[200px] z-50">
                    <button
                      onClick={() => {
                        setShowRegistrationForm(true);
                        setShowRegistrationDropdown(false);
                      }}
                      className="w-full px-6 py-3 text-left text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold text-sm"
                    >
                      LA MIRA
                    </button>
                  </div>
                )}
              </div> */}
              <Link
                to="/creators"
                className={`px-6 py-2 rounded-full font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                  location.pathname === "/creators"
                    ? "bg-white/20 text-white shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Creators
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-red-500">LA MIRA</h2>
                <button
                  onClick={() => setShowRegistrationForm(false)}
                  className="text-white/70 hover:text-white text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Success/Error Message */}
              {message.text && (
                <div className={`p-4 rounded-lg mb-4 ${
                  message.type === 'success'
                    ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                    : 'bg-red-500/20 border border-red-500/50 text-red-300'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Leader Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white/90 border-b border-white/20 pb-2">
                    Team Leader
                  </h3>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="leaderName"
                      value={formData.leaderName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="Enter leader name"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="leaderPhone"
                      value={formData.leaderPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="Enter phone number"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Department
                    </label>
                    <select
                      name="leaderDepartment"
                      value={formData.leaderDepartment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                      required
                      disabled={loading}
                    >
                      <option value="" className="bg-gray-800">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept} className="bg-gray-800">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Member 1 Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white/90 border-b border-white/20 pb-2">
                    Member 1
                  </h3>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="member1Name"
                      value={formData.member1Name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="Enter member name"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Department
                    </label>
                    <select
                      name="member1Department"
                      value={formData.member1Department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                      required
                      disabled={loading}
                    >
                      <option value="" className="bg-gray-800">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept} className="bg-gray-800">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Member 2 Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white/90 border-b border-white/20 pb-2">
                    Member 2
                  </h3>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="member2Name"
                      value={formData.member2Name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="Enter member name"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Department
                    </label>
                    <select
                      name="member2Department"
                      value={formData.member2Department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                      required
                      disabled={loading}
                    >
                      <option value="" className="bg-gray-800">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept} className="bg-gray-800">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment QR Code Display Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white/90 border-b border-white/20 pb-2">
                    Payment QR Code
                  </h3>

                  <div className="text-center">
                    <p className="text-white/80 text-sm mb-4">
                      Scan the QR code below to make the payment
                    </p>

                    <div className="flex justify-center p-6 bg-white/5 rounded-xl border border-white/20">
                      {/* QR Code Image - Replace the src with your actual QR code */}
                      <div className="bg-white p-4 rounded-lg">
                        <img
                          src={paymentQRCode}
                          alt="Payment QR Code"
                          className="w-64 h-64 object-contain"
                        />
                      </div>
                    </div>

                    <p className="text-white/60 text-xs mt-3">
                      Please complete the payment before submitting the form
                    </p>
                  </div>
                </div>

                {/* Payment Screenshot Upload */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white/90 border-b border-white/20 pb-2">
                    Upload Payment Screenshot
                  </h3>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Payment Screenshot *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/20 file:text-white file:cursor-pointer hover:file:bg-white/30"
                      required
                      disabled={loading}
                    />
                    <p className="text-white/60 text-xs mt-2">
                      Upload a screenshot of your payment confirmation
                    </p>
                  </div>

                  {screenshotPreview && (
                    <div className="mt-4">
                      <p className="text-white/80 text-sm mb-2">Preview:</p>
                      <div className="flex justify-center p-4 bg-white/5 rounded-xl border border-white/20">
                        <img
                          src={screenshotPreview}
                          alt="Payment Screenshot Preview"
                          className="max-w-md max-h-64 object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit Registration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Events Popup Modal */}
      {showEventsPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowEventsPopup(false)}>
          <div className="bg-black border border-white/30 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold text-white">All Events</h2>
                <button
                  onClick={() => setShowEventsPopup(false)}
                  className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:rotate-90"
                >
                  <span className="text-2xl leading-none">×</span>
                </button>
              </div>

              {/* RC Events Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-white/30 pb-2">
                  RC Events
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/BD"
                    onClick={() => setShowEventsPopup(false)}
                    className="group p-6 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300"
                  >
                    <h4 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                      Bomb Diffusion
                    </h4>
                    <p className="text-white/60 text-sm mt-2">Technical Challenge Event</p>
                  </Link>
                  <Link
                    to="/NFS"
                    onClick={() => setShowEventsPopup(false)}
                    className="group p-6 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300"
                  >
                    <h4 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                      Electro NFS
                    </h4>
                    <p className="text-white/60 text-sm mt-2">Racing Competition</p>
                  </Link>
                  <Link
                    to="/Tekken"
                    onClick={() => setShowEventsPopup(false)}
                    className="group p-6 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300"
                  >
                    <h4 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                      Electro Tekken
                    </h4>
                    <p className="text-white/60 text-sm mt-2">Gaming Tournament</p>
                  </Link>
                  <Link
                    to="/Sher"
                    onClick={() => setShowEventsPopup(false)}
                    className="group p-6 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300"
                  >
                    <h4 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                      Sherlocked
                    </h4>
                    <p className="text-white/60 text-sm mt-2">Mystery Solving Challenge</p>
                  </Link>
                </div>
              </div>

              {/* TSC Events Section */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-white/30 pb-2">
                  TSC Events
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/Lamira"
                    onClick={() => setShowEventsPopup(false)}
                    className="group p-6 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300"
                  >
                    <h4 className="text-xl font-semibold text-white group-hover:text-pink-400 transition-colors duration-300">
                      La Mira
                    </h4>
                    <p className="text-white/60 text-sm mt-2">Treasure Hunt Adventure</p>
                  </Link>
                  <Link
                    to="/Aeromodelling"
                    onClick={() => setShowEventsPopup(false)}
                    className="group p-6 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300"
                  >
                    <h4 className="text-xl font-semibold text-white group-hover:text-pink-400 transition-colors duration-300">
                      Malaviya Aeromodelling
                    </h4>
                    <p className="text-white/60 text-sm mt-2">Drone & Aircraft Competition</p>
                  </Link>
                  <Link
                    to="/ScienceExpo"
                    onClick={() => setShowEventsPopup(false)}
                    className="group p-6 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300"
                  >
                    <h4 className="text-xl font-semibold text-white group-hover:text-pink-400 transition-colors duration-300">
                      Science Exhibition
                    </h4>
                    <p className="text-white/60 text-sm mt-2">Innovation Showcase</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
