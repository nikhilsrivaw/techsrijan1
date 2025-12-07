import React, { useState, useEffect } from 'react';
// import { gsap } from 'gsap';
// import { supabaseService } from '../lib/supabase';
import { adminAuthService } from '../lib/adminAuth';
import AdminLogin from '../components/AdminLogin';
import { getAllRegistrations } from '../lib/laMiraService';

const AdminNew = () => {
  console.log('🎯 AdminNew component is loading...');

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [activeSection, setActiveSection] = useState('');
  const [showInsertTeamForm, setShowInsertTeamForm] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    instagram_reel: '',
    show_on_homepage: false
  });
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [hotEvents, setHotEvents] = useState([]);
  const [teamRegistrations, setTeamRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationFilter, setRegistrationFilter] = useState('all');
  const [searchRollNumber, setSearchRollNumber] = useState('');

  // QR & UPI Settings state
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [qrCodePreview, setQrCodePreview] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [currentQrCodeUrl, setCurrentQrCodeUrl] = useState(null);
  const [currentUpiId, setCurrentUpiId] = useState('');

  // Admin Authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Bank Details State
  const [bankDetails, setBankDetails] = useState({
    account_number: '',
    ifsc_code: '',
    is_confirmed: false
  });
  const [existingBankDetails, setExistingBankDetails] = useState(null);
  const [isEditingBank, setIsEditingBank] = useState(false);


  // Authentication functions
  const checkAdminAuthentication = async () => {
    console.log('🔍 Checking admin authentication...');
    setAuthLoading(true);
    try {
      const result = await adminAuthService.verifySession();
      console.log('🔐 Auth verification result:', result);
      if (result.success) {
        console.log('✅ User is authenticated');
        setIsAdminAuthenticated(true);
        setAdminData(result.adminData);
      } else {
        console.log('❌ User not authenticated, showing login modal');
        setIsAdminAuthenticated(false);
        setAdminData(null);
        setShowLoginModal(true);
      }
    } catch (error) {
      console.error('🚨 Auth check error:', error);
      setIsAdminAuthenticated(false);
      setShowLoginModal(true);
    } finally {
      setAuthLoading(false);
      console.log('🏁 Auth loading completed');
    }
  };

  const handleLoginSuccess = (adminUserData) => {
    setIsAdminAuthenticated(true);
    setAdminData(adminUserData);
    setShowLoginModal(false);
    setError(null);
  };

  const handleLoginCancel = () => {
    // Redirect to home page or show access denied
    window.location.href = '/';
  };

  const handleAdminLogout = () => {
    adminAuthService.logout();
    setIsAdminAuthenticated(false);
    setAdminData(null);
    setShowLoginModal(true);
  };

  // Helper function to filter registrations
  const getFilteredRegistrations = () => {
    return teamRegistrations.filter(registration => {
      // Filter by status
      const statusMatch = registrationFilter === 'all' || registration.registration_status === registrationFilter;

      // Filter by roll number search
      const rollNumberMatch = !searchRollNumber ||
        registration.leader_roll?.toLowerCase().includes(searchRollNumber.toLowerCase());

      return statusMatch && rollNumberMatch;
    });
  };

  // Load hot events from database
  const loadHotEvents = async () => {
    setLoading(true);
    try {
      const events = await supabaseService.getHotEvents();
      setHotEvents(events || []);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load team registrations from database
  const loadTeamRegistrations = async () => {
    setLoading(true);
    try {
      const registrations = await supabaseService.getTeamRegistrations();
      setTeamRegistrations(registrations || []);
    } catch (err) {
      setError('Failed to load team registrations');
      console.error('Error loading team registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load QR & UPI settings from database
  const loadQrUpiSettings = async () => {
    try {
      const settings = await supabaseService.getQrUpiSettings();
      if (settings) {
        setCurrentQrCodeUrl(settings.qr_code_url);
        setCurrentUpiId(settings.upi_id || '');
        setUpiId(settings.upi_id || '');
      }
    } catch (err) {
      console.error('Error loading QR & UPI settings:', err);
    }
  };

  // Validate UPI ID format
  const validateUpiId = (upiId) => {
    if (!upiId.trim()) {
      return 'UPI ID is required';
    }

    // Basic UPI ID format validation
    const upiPattern = /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z0-9.-]{2,64}$/;
    if (!upiPattern.test(upiId)) {
      return 'Please enter a valid UPI ID (e.g., user@paytm, user@phonepe)';
    }

    return null;
  };

  // Save QR & UPI settings with validation
  const handleSaveQrUpiSettings = async (e) => {
    e.preventDefault();

    // Validate UPI ID
    const upiError = validateUpiId(upiId);
    if (upiError) {
      setError(upiError);
      return;
    }

    // Check if we have either a new QR code or existing one
    if (!qrCodeFile && !currentQrCodeUrl) {
      setError('Please upload a QR code image');
      return;
    }

    setLoading(true);
    try {
      let qrCodeUrl = currentQrCodeUrl;

      if (qrCodeFile) {
        const uploadResult = await supabaseService.uploadQrCodeImage(qrCodeFile);
        qrCodeUrl = uploadResult.url;
      }

      await supabaseService.saveQrUpiSettings({
        qr_code_url: qrCodeUrl,
        upi_id: upiId.trim()
      });

      setCurrentQrCodeUrl(qrCodeUrl);
      setCurrentUpiId(upiId.trim());
      setQrCodeFile(null);
      setQrCodePreview(null);
      setError(null);

      // Show success message
      const successMsg = qrCodeFile ? 'QR code uploaded and UPI settings saved successfully!' : 'UPI settings updated successfully!';
      alert(successMsg);
    } catch (err) {
      setError(`Failed to save QR & UPI settings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete QR & UPI settings
  const handleDeleteQrUpiSettings = async () => {
    if (!confirm('Are you sure you want to delete the current QR code and UPI ID? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await supabaseService.deleteQrUpiSettings();
      setCurrentQrCodeUrl(null);
      setCurrentUpiId('');
      setUpiId('');
      setQrCodeFile(null);
      setQrCodePreview(null);
      setError(null);
      alert('QR & UPI settings deleted successfully!');
    } catch (err) {
      setError(`Failed to delete QR & UPI settings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Update registration status
  const updateRegistrationStatus = async (id, status) => {
    try {
      await supabaseService.updateRegistrationStatus(id, status);
      // Reload registrations to reflect changes
      await loadTeamRegistrations();
      setError(null);
    } catch (err) {
      setError(`Failed to ${status} registration`);
      console.error('Error updating registration status:', err);
    }
  };

  // Enable Step 2 for a team
  const enableStep2ForTeam = async (id) => {
    try {
      await supabaseService.enableStep2ForTeam(id);
      // Reload registrations to reflect changes
      await loadTeamRegistrations();
      setError(null);
    } catch (err) {
      setError('Failed to enable Step 2 for team');
      console.error('Error enabling Step 2:', err);
    }
  };

  // Handle poster file selection
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPosterPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle QR code file selection with validation
  const handleQrCodeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (PNG, JPG, JPEG, etc.)');
        e.target.value = '';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        e.target.value = '';
        return;
      }

      // Validate image dimensions (optional - QR codes should be square)
      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          setError('QR code image should be at least 100x100 pixels');
          e.target.value = '';
          return;
        }

        setQrCodeFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setQrCodePreview(e.target.result);
        reader.readAsDataURL(file);
        setError(null); // Clear any previous errors
      };

      img.onerror = () => {
        setError('Invalid image file. Please select a valid QR code image.');
        e.target.value = '';
      };

      img.src = URL.createObjectURL(file);
    }
  };

  // Handle adding new hot event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.name || !eventForm.description) return;

    setLoading(true);
    try {
      let posterImageUrl = null;
      let posterImagePath = null;

      if (posterFile) {
        const uploadResult = await supabaseService.uploadPosterImage(posterFile, eventForm.name);
        posterImageUrl = uploadResult.url;
        posterImagePath = uploadResult.path;
      }

      const eventData = {
        ...eventForm,
        poster_image_url: posterImageUrl,
        poster_image_path: posterImagePath
      };

      const newEvent = await supabaseService.createHotEvent(eventData);
      setHotEvents([newEvent, ...hotEvents]);
      setEventForm({ name: '', description: '', instagram_reel: '', show_on_homepage: false });
      setPosterFile(null);
      setPosterPreview(null);
      setShowAddEventForm(false);
    } catch (err) {
      setError(`Failed to create event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting event
  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    setLoading(true);
    try {
      await supabaseService.deleteHotEvent(id);
      setHotEvents(hotEvents.filter(event => event.id !== id));
    } catch (err) {
      console.error('Delete event error:', err);
      setError('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle homepage visibility
  const handleToggleHomepage = async (id, currentStatus) => {
    setLoading(true);
    try {
      await supabaseService.updateHotEvent(id, { show_on_homepage: !currentStatus });
      setHotEvents(hotEvents.map(event =>
        event.id === id ? { ...event, show_on_homepage: !currentStatus } : event
      ));
    } catch (err) {
      console.error('Update event error:', err);
      setError('Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  // Load bank details from database
  const loadBankDetails = async () => {
    try {
      // First test if table exists
      const tableExists = await supabaseService.testBankTableExists();
      if (!tableExists) {
        console.warn('⚠️ bank_details table does not exist. Please create it in Supabase.');
        setError('Bank details table not found. Please create the database table first.');
        return;
      }

      const details = await supabaseService.getBankDetails();
      if (details) {
        setExistingBankDetails(details);
        setBankDetails(details);
      }
    } catch (err) {
      console.error('Error loading bank details:', err);
    }
  };

  // Handle saving bank details
  const handleSaveBankDetails = async () => {
    if (!bankDetails.account_number || !bankDetails.ifsc_code) {
      setError('Please fill in both account number and IFSC code');
      return;
    }

    if (!bankDetails.is_confirmed) {
      setError('Please confirm that the bank details are correct');
      return;
    }

    setLoading(true);
    try {
      console.log('🏦 Attempting to save bank details:', bankDetails);
      const savedDetails = await supabaseService.saveBankDetails(bankDetails);
      console.log('✅ Bank details saved successfully:', savedDetails);
      setExistingBankDetails(savedDetails);
      setBankDetails(savedDetails);
      setIsEditingBank(false);
      setError(null);
    } catch (err) {
      console.error('❌ Detailed error saving bank details:', err);
      console.error('Error message:', err.message);
      console.error('Error details:', err);
      setError(`Failed to save bank details: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle editing bank details
  const handleEditBankDetails = () => {
    setIsEditingBank(true);
    setBankDetails({ ...existingBankDetails, is_confirmed: false });
  };

  // Handle deleting bank details
  const handleDeleteBankDetails = async () => {
    if (!confirm('Are you sure you want to delete the bank details?')) return;

    setLoading(true);
    try {
      await supabaseService.deleteBankDetails();
      setExistingBankDetails(null);
      setBankDetails({ account_number: '', ifsc_code: '', is_confirmed: false });
      setIsEditingBank(false);
      setError(null);
    } catch (err) {
      setError('Failed to delete bank details');
      console.error('Error deleting bank details:', err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    console.log('🚀 AdminNew component mounted, starting auth check');
    // Check admin authentication first
    checkAdminAuthentication();
  }, []);

  useEffect(() => {
    // Load data only if authenticated
    if (isAdminAuthenticated) {
      loadHotEvents();
      loadTeamRegistrations();
      loadQrUpiSettings();
      loadBankDetails();
    }
  }, [isAdminAuthenticated]);

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle section change with mobile sidebar auto-close
  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Auto-close sidebar on mobile when a section is selected
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const stats = [
    { title: 'Total Events', value: hotEvents.length.toString(), icon: '🔥', color: 'from-blue-400 to-cyan-400' },
    { title: 'Homepage Events', value: hotEvents.filter(e => e.show_on_homepage).length.toString(), icon: '🏠', color: 'from-purple-400 to-pink-400' },
    { title: 'Team Registrations', value: teamRegistrations.length.toString(), icon: '👥', color: 'from-green-400 to-blue-400' },
    { title: 'Pending Reviews', value: teamRegistrations.filter(r => r.registration_status === 'pending').length.toString(), icon: '⏳', color: 'from-yellow-400 to-orange-400' },
    { title: 'With Instagram', value: hotEvents.filter(e => e.instagram_reel).length.toString(), icon: '📱', color: 'from-green-400 to-emerald-400' },
    { title: 'With Posters', value: hotEvents.filter(e => e.poster_image_url).length.toString(), icon: '🖼️', color: 'from-orange-400 to-red-400' }
  ];

  // Debug logging
  console.log('🎯 AdminNew render state:', {
    authLoading,
    isAdminAuthenticated,
    showLoginModal,
    adminData
  });

  // Show loading screen while checking authentication
  if (authLoading) {
    console.log('⏳ Showing loading screen');
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #333',
            borderTop: '4px solid #4facfe',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#f0f0f0', fontSize: '1.125rem' }}>
            Checking admin access...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Show login modal if not authenticated
  if (!isAdminAuthenticated || showLoginModal) {
    console.log('🔐 Showing login modal');
    return (
      <div>
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={handleLoginCancel}
        />
      </div>
    );
  }

  console.log('✅ Showing admin dashboard');

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0f0f0f;
          color: #f0f0f0;
        }

        .gradient-text {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          font-weight: 700;
        }

        .gradient-text-purple {
          background: linear-gradient(135deg, #a960ee 0%, #ff333d 50%, #90e0ff 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          font-weight: 700;
        }

        .gradient-text-green {
          background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          font-weight: 700;
        }

        .admin-container {
          min-height: 100vh;
          display: flex;
          background: #0f0f0f;
        }

        .sidebar {
          width: 280px;
          background: #1a1a1a;
          border-right: 1px solid #333;
          padding: 2rem 0;
          position: fixed;
          height: 100vh;
          z-index: 1000;
          transition: transform 0.3s ease;
          left: 0;
          top: 0;
        }

        .sidebar.closed {
          transform: translateX(-100%);
        }

        /* Desktop sidebar behavior */
        @media (min-width: 769px) {
          .sidebar.closed {
            transform: translateX(-100%);
          }

          .main-content {
            margin-left: 280px;
          }

          .main-content.sidebar-closed {
            margin-left: 0;
          }
        }

        /* Mobile sidebar starts closed */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            width: 100%;
            z-index: 1001;
          }

          .sidebar:not(.closed) {
            transform: translateX(0);
          }

          .main-content {
            margin-left: 0;
          }
        }

        /* Mobile backdrop */
        .mobile-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .mobile-backdrop.active {
          opacity: 1;
          visibility: visible;
        }

        @media (min-width: 769px) {
          .mobile-backdrop {
            display: none;
          }
        }

        .sidebar-header {
          padding: 0 2rem 2rem;
          border-bottom: 1px solid #333;
          margin-bottom: 2rem;
          position: relative;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sidebar-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #aaa;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.25rem;
          transition: all 0.2s ease;
          display: none;
          line-height: 1;
          width: 2rem;
          height: 2rem;
          align-items: center;
          justify-content: center;
        }

        .sidebar-close:hover {
          background: #333;
          color: #fff;
        }

        @media (max-width: 768px) {
          .sidebar-close {
            display: flex;
          }

          .sidebar-header {
            padding-top: 1rem;
          }
        }

        .sidebar-nav {
          padding: 0 1rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          margin-bottom: 0.5rem;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #aaa;
          text-decoration: none;
        }

        .nav-item:hover {
          background: #2d2d2d;
          color: #f0f0f0;
        }

        .nav-item.active {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(79, 172, 254, 0.3);
        }

        .main-content {
          flex: 1;
          transition: margin-left 0.3s ease;
          padding: 1rem;
        }

        .header {
          background: #1a1a1a;
          border-bottom: 1px solid #333;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .hamburger {
          background: none;
          border: none;
          color: #f0f0f0;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.3s ease;
        }

        .hamburger:hover {
          background-color: #2d2d2d;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .search-input {
          background: #2d2d2d;
          border: 1px solid #444;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          color: #f0f0f0;
          width: 300px;
        }

        .search-input::placeholder {
          color: #888;
        }

        .content {
          padding: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 1rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .stat-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #aaa;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .dashboard-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 1rem;
          padding: 2rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          background: linear-gradient(135deg, #a960ee 0%, #ff333d 50%, #90e0ff 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(79, 172, 254, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(79, 172, 254, 0.4);
        }

        .btn-secondary {
          background: #2d2d2d;
          color: #f0f0f0;
          border: 1px solid #444;
        }

        .btn-secondary:hover {
          background: #3d3d3d;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #f0f0f0;
          font-weight: 500;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 0.875rem;
          background: #2d2d2d;
          border: 1px solid #444;
          border-radius: 0.5rem;
          color: #f0f0f0;
          transition: all 0.3s ease;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #4facfe;
          box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .file-input-wrapper {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .file-input {
          width: 100%;
          padding: 0.875rem;
          background: #2d2d2d;
          border: 1px solid #444;
          border-radius: 0.5rem;
          color: #f0f0f0;
          cursor: pointer;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #444;
          transition: 0.4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .event-card {
          background: #2d2d2d;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1rem;
          border: 1px solid #444;
          transition: all 0.3s ease;
        }

        .event-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .event-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        .event-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #f0f0f0;
        }

        .event-description {
          color: #aaa;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .event-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .event-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .badge-homepage {
          background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
          color: white;
        }

        .badge-instagram {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
          color: white;
        }

        .badge-poster {
          background: linear-gradient(135deg, #a960ee 0%, #ff333d 100%);
          color: white;
        }

        .event-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-small {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .btn-danger {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
          color: white;
        }

        .btn-danger:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #333;
          border-top: 3px solid #4facfe;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-alert {
          background: #ff4757;
          color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .preview-image {
          width: 100%;
          max-width: 200px;
          height: 120px;
          object-fit: cover;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
        }

        @media (max-width: 768px) {

          .main-content {
            margin-left: 0;
            padding: 1rem;
          }

          .header {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 1rem;
            width: 100%;
          }

          .header-right {
            width: 100%;
            justify-content: center;
          }

          .search-input {
            width: 100%;
            max-width: 300px;
          }

          .page-title {
            font-size: 1.25rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .dashboard-card {
            padding: 1rem;
          }

          .card-title {
            font-size: 1rem;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-input,
          .form-textarea,
          .form-select {
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .btn {
            width: 100%;
            padding: 0.875rem;
            margin-bottom: 0.5rem;
          }

          .filter-controls {
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
          }

          .filter-select {
            width: 100%;
          }

          .registrations-grid {
            grid-template-columns: 1fr;
          }

          .event-card {
            padding: 1rem;
          }

          .event-image {
            height: 150px;
          }

          /* Bank Details Mobile Styles */
          .bank-details-container {
            padding: 1rem;
          }

          .bank-details-form {
            gap: 1rem;
          }

          .bank-details-actions {
            flex-direction: column;
            gap: 0.5rem;
          }

          .bank-details-actions button {
            width: 100%;
          }

          /* Navigation adjustments */
          .nav-item {
            padding: 1rem;
            font-size: 0.875rem;
          }

          .sidebar-header {
            padding: 1rem;
          }

          .sidebar-nav {
            padding: 0 0.5rem;
          }

          /* Responsive tables/lists */
          .registration-card {
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .registration-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .registration-actions {
            width: 100%;
            justify-content: space-between;
          }

          /* Form inputs mobile optimization */
          input[type="text"],
          input[type="email"],
          input[type="url"],
          textarea,
          select {
            font-size: 16px !important; /* Prevents iOS zoom */
            -webkit-appearance: none;
            border-radius: 0.5rem;
          }

          /* Prevent horizontal scroll */
          .main-content {
            overflow-x: hidden;
          }

          .dashboard-grid {
            width: 100%;
            overflow-x: hidden;
          }

          /* Touch-friendly button sizes */
          .hamburger {
            padding: 0.75rem;
            font-size: 1.25rem;
          }

          /* Better spacing for mobile */
          .content {
            padding: 1rem 0;
          }

          .stats-grid .stat-card {
            min-height: 100px;
          }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .page-title {
            font-size: 1.125rem;
          }

          .sidebar {
            width: 100vw;
          }

          .header-right {
            flex-direction: column;
            gap: 0.5rem;
          }

          .search-input {
            width: 100%;
          }

          .btn {
            font-size: 0.875rem;
            padding: 0.75rem;
          }

          .dashboard-card {
            padding: 0.75rem;
          }

          .form-input,
          .form-textarea {
            padding: 0.75rem;
          }
        }

        /* Team Registrations Styles */
        .full-width {
          grid-column: 1 / -1;
        }

        .filter-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .filter-select {
          background: #2d2d2d;
          border: 1px solid #444;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          color: #f0f0f0;
          cursor: pointer;
        }

        .registrations-grid {
          display: grid;
          gap: 1.5rem;
        }

        .registration-card {
          background: #2d2d2d;
          border: 1px solid #444;
          border-radius: 1rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .registration-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .registration-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #444;
        }

        .team-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .team-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f0f0f0;
          margin: 0;
        }

        .app-number {
          font-size: 0.875rem;
          color: #4facfe;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          margin: 0.25rem 0;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-pending {
          background: linear-gradient(135deg, #ffd93d 0%, #ff8800 100%);
          color: #000;
        }

        .status-verified {
          background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
          color: white;
        }

        .status-rejected {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
          color: white;
        }

        .registration-date {
          color: #aaa;
          font-size: 0.875rem;
        }

        .member-section {
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #4facfe;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .member-details {
          background: #1a1a1a;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .member-details div {
          margin-bottom: 0.5rem;
          color: #f0f0f0;
        }

        .member-details div:last-child {
          margin-bottom: 0;
        }

        .payment-proof {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .payment-image {
          max-width: 300px;
          max-height: 200px;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .payment-image:hover {
          transform: scale(1.05);
        }

        .payment-status {
          color: #aaa;
          font-size: 0.875rem;
        }

        .no-payment {
          color: #ff6b6b;
          font-style: italic;
        }

        .registration-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #444;
        }

        .btn-success {
          background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
          color: white;
        }

        .btn-success:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(67, 206, 162, 0.3);
        }

        .btn-warning {
          background: linear-gradient(135deg, #ffd93d 0%, #ff8800 100%);
          color: #000;
        }

        .btn-warning:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(255, 217, 61, 0.3);
        }

        .no-registrations {
          text-align: center;
          color: #aaa;
          font-style: italic;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .registration-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .registration-actions {
            flex-direction: column;
          }

          .payment-image {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="admin-container">
        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Mobile Backdrop */}
        <div
          className={`mobile-backdrop ${sidebarOpen && window.innerWidth <= 768 ? 'active' : ''}`}
          onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <aside className={`sidebar ${!sidebarOpen ? 'closed' : ''}`}>
          <div className="sidebar-header">
            <button
              className="sidebar-close"
              onClick={() => setSidebarOpen(false)}
              title="Close sidebar"
            >
              ×
            </button>
            <div className="sidebar-logo">
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>S</div>
              <div>
                <h2 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>SAE Admin</h2>
                <p style={{ color: '#888', fontSize: '0.875rem' }}>Hot Events Portal</p>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${showInsertTeamForm ? 'active' : ''}`}
              onClick={() => {
                setShowInsertTeamForm(true);
                setShowRegistrations(false);
                setActiveSection('insert-team');
                if (window.innerWidth <= 768) {
                  setSidebarOpen(false);
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                background: showInsertTeamForm ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '0.75rem',
                transition: 'all 0.3s ease'
              }}
            >
              <span>➕</span>
              <span>Insert Team</span>
            </button>

            <button
              className={`nav-item ${showRegistrations ? 'active' : ''}`}
              onClick={async () => {
                setShowRegistrations(true);
                setShowInsertTeamForm(false);
                setActiveSection('registrations');

                // Fetch registrations
                const result = await getAllRegistrations();
                if (result.success) {
                  setRegistrations(result.data);
                }

                if (window.innerWidth <= 768) {
                  setSidebarOpen(false);
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                background: showRegistrations ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '0.75rem',
                transition: 'all 0.3s ease',
                marginTop: '0.5rem'
              }}
            >
              <span>📋</span>
              <span>LA MIRA Registrations</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
          {/* Header */}
          <header className="header">
            <div className="header-left">
              <button
                className="hamburger"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                ☰
              </button>
              <h1 className="page-title">
                {activeSection === 'insert-team' ? 'Insert Team' :
                 activeSection === 'registrations' ? 'LA MIRA Registrations' :
                 'Admin Panel'}
              </h1>
            </div>
            <div className="header-right">
              <input
                type="search"
                placeholder="Search events..."
                className="search-input"
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  className="btn btn-primary"
                  style={{
                    padding: '0.5rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  Registration
                </button>
                <span style={{ color: '#aaa', fontSize: '0.875rem' }}>
                  Welcome, {adminData?.username || 'Admin'}
                </span>
                <button
                  onClick={handleAdminLogout}
                  style={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)',
                    border: 'none',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  title="Logout"
                >
                  🚪 Logout
                </button>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #a960ee 0%, #ff333d 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {adminData?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="content">
            {/* Error Alert */}
            {error && (
              <div className="error-alert">
                <span>{error}</span>
                <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>×</button>
              </div>
            )}


            {/* Insert Team Section */}
            {showInsertTeamForm ? (
              <div className="dashboard-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="card-header">
                  <h3 className="card-title">➕ Insert New Team</h3>
                </div>
                <form style={{ padding: '2rem' }}>
                  <div className="form-group">
                    <label className="form-label">Team Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter team name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Team Leader Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter team leader name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Team Leader Roll Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter roll number"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Branch *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter branch (e.g., CSE, ECE)"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      Insert Team
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowInsertTeamForm(false);
                        setActiveSection('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : showRegistrations ? (
              <div className="dashboard-card" style={{ margin: '0 auto', width: '100%' }}>
                <div className="card-header">
                  <h3 className="card-title">📋 LA MIRA Registrations</h3>
                  <div className="badge" style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white'
                  }}>
                    {registrations.length} teams
                  </div>
                </div>

                <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
                  {registrations.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #374151' }}>
                          <th style={{ padding: '1rem', textAlign: 'left', color: '#f0f0f0' }}>Leader Name</th>
                          <th style={{ padding: '1rem', textAlign: 'left', color: '#f0f0f0' }}>Phone</th>
                          <th style={{ padding: '1rem', textAlign: 'left', color: '#f0f0f0' }}>Department</th>
                          <th style={{ padding: '1rem', textAlign: 'left', color: '#f0f0f0' }}>Member 1</th>
                          <th style={{ padding: '1rem', textAlign: 'left', color: '#f0f0f0' }}>Member 2</th>
                          <th style={{ padding: '1rem', textAlign: 'left', color: '#f0f0f0' }}>Payment</th>
                          <th style={{ padding: '1rem', textAlign: 'left', color: '#f0f0f0' }}>Status</th>
                          <th style={{ padding: '1rem', textAlign: 'left', color: '#f0f0f0' }}>Registered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((reg) => (
                          <tr key={reg.id} style={{ borderBottom: '1px solid #2d2d2d' }}>
                            <td style={{ padding: '1rem', color: '#fff' }}>{reg.leader_name}</td>
                            <td style={{ padding: '1rem', color: '#aaa' }}>{reg.leader_phone}</td>
                            <td style={{ padding: '1rem', color: '#aaa' }}>{reg.leader_department}</td>
                            <td style={{ padding: '1rem', color: '#aaa' }}>
                              {reg.member1_name}<br/>
                              <span style={{ fontSize: '0.75rem', color: '#666' }}>{reg.member1_department}</span>
                            </td>
                            <td style={{ padding: '1rem', color: '#aaa' }}>
                              {reg.member2_name}<br/>
                              <span style={{ fontSize: '0.75rem', color: '#666' }}>{reg.member2_department}</span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              {reg.payment_screenshot_url ? (
                                <a
                                  href={reg.payment_screenshot_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#4facfe', textDecoration: 'none' }}
                                >
                                  View Screenshot
                                </a>
                              ) : (
                                <span style={{ color: '#666' }}>No screenshot</span>
                              )}
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                background: reg.status === 'pending' ? '#fbbf24' : reg.status === 'verified' ? '#10b981' : '#ef4444',
                                color: 'white'
                              }}>
                                {reg.status}
                              </span>
                            </td>
                            <td style={{ padding: '1rem', color: '#aaa', fontSize: '0.875rem' }}>
                              {new Date(reg.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                      <p style={{ color: '#aaa' }}>No registrations yet</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🎯</div>
                <h2 style={{ color: '#f0f0f0', fontSize: '2rem', marginBottom: '1rem' }}>Admin Panel</h2>
                <p style={{ color: '#aaa', fontSize: '1.125rem' }}>Select an option from the sidebar</p>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
};

export default AdminNew;