import { supabase } from './supabaseClient';

/**
 * LA MIRA Registration Service
 * Handles all database operations for LA MIRA event registrations
 */

// Upload payment screenshot to Supabase Storage
const uploadPaymentScreenshot = async (file, teamLeaderName) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${teamLeaderName.replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;
    const filePath = `payment-screenshots/${fileName}`;

    const { data, error } = await supabase.storage
      .from('la-mira-payments')
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('la-mira-payments')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading screenshot:', error);
    return { success: false, error: error.message };
  }
};

// Register a new team for LA MIRA
export const registerTeam = async (teamData, paymentScreenshot) => {
  try {
    let paymentScreenshotUrl = null;

    // Upload payment screenshot if provided
    if (paymentScreenshot) {
      const uploadResult = await uploadPaymentScreenshot(paymentScreenshot, teamData.leaderName);
      if (!uploadResult.success) {
        throw new Error('Failed to upload payment screenshot');
      }
      paymentScreenshotUrl = uploadResult.url;
    }

    const { data, error } = await supabase
      .from('la_mira_registrations')
      .insert([
        {
          // Team Leader
          leader_name: teamData.leaderName,
          leader_phone: teamData.leaderPhone,
          leader_department: teamData.leaderDepartment,

          // Member 1
          member1_name: teamData.member1Name,
          member1_department: teamData.member1Department,

          // Member 2
          member2_name: teamData.member2Name,
          member2_department: teamData.member2Department,

          // Payment
          payment_screenshot_url: paymentScreenshotUrl,

          // Metadata
          created_at: new Date().toISOString(),
          status: 'pending'
        }
      ])
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error registering team:', error);
    return { success: false, error: error.message };
  }
};

// Get all LA MIRA registrations
export const getAllRegistrations = async () => {
  try {
    const { data, error } = await supabase
      .from('la_mira_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return { success: false, error: error.message };
  }
};

// Get a specific registration by ID
export const getRegistrationById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('la_mira_registrations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching registration:', error);
    return { success: false, error: error.message };
  }
};

// Update registration status
export const updateRegistrationStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('la_mira_registrations')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error updating registration status:', error);
    return { success: false, error: error.message };
  }
};

// Delete a registration
export const deleteRegistration = async (id) => {
  try {
    const { error } = await supabase
      .from('la_mira_registrations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting registration:', error);
    return { success: false, error: error.message };
  }
};
