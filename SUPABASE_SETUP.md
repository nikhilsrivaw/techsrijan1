# Supabase Setup for LA MIRA Registration

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in your project details:
   - Project name: `techsrijan-lamira` (or your preferred name)
   - Database password: (create a strong password)
   - Region: Choose the closest to your users
5. Click "Create new project"

## Step 2: Get Your Supabase Credentials

1. Once your project is created, go to **Settings** (gear icon) → **API**
2. You'll find:
   - **Project URL**: Copy this
   - **anon/public key**: Copy this

## Step 3: Configure Environment Variables

1. Open the `.env` file in the root of your project
2. Replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 4: Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire content from `supabase-setup.sql` file
4. Paste it into the SQL editor
5. Click "Run" or press Ctrl+Enter

This will create:
- The `la_mira_registrations` table with all necessary fields
- Indexes for better performance
- Row Level Security policies
- Auto-update trigger for timestamps

## Step 5: Verify Table Creation

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the `la_mira_registrations` table
3. Check that it has these columns:
   - id (UUID)
   - leader_name (Text)
   - leader_phone (Text)
   - leader_department (Text)
   - member1_name (Text)
   - member1_department (Text)
   - member2_name (Text)
   - member2_department (Text)
   - status (Text)
   - created_at (Timestamp)
   - updated_at (Timestamp)

## Step 6: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Open your website
3. Click on "Registration" button
4. Fill out the LA MIRA registration form
5. Submit the form
6. Check your Supabase dashboard → Table Editor → la_mira_registrations to see the new entry

## Database Schema

### la_mira_registrations Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| leader_name | TEXT | Team leader's name |
| leader_phone | TEXT | Team leader's phone number |
| leader_department | TEXT | Team leader's department |
| member1_name | TEXT | First member's name |
| member1_department | TEXT | First member's department |
| member2_name | TEXT | Second member's name |
| member2_department | TEXT | Second member's department |
| status | TEXT | Registration status (pending/approved/rejected) |
| created_at | TIMESTAMP | Auto-generated timestamp |
| updated_at | TIMESTAMP | Auto-updated timestamp |

## Security Policies

The table has Row Level Security (RLS) enabled with these policies:

- **Public Insert**: Anyone can submit a registration
- **Authenticated Read**: Only authenticated users can view registrations
- **Authenticated Update**: Only authenticated users can update registrations
- **Authenticated Delete**: Only authenticated users can delete registrations

## Available Functions

The `laMiraService.js` provides these functions:

- `registerTeam(teamData)` - Submit a new registration
- `getAllRegistrations()` - Get all registrations (admin only)
- `getRegistrationById(id)` - Get a specific registration
- `updateRegistrationStatus(id, status)` - Update registration status
- `deleteRegistration(id)` - Delete a registration

## Troubleshooting

### Error: Missing Supabase environment variables
- Make sure your `.env` file is in the root directory
- Restart your dev server after adding environment variables

### Error: Permission denied
- Check that Row Level Security policies are set up correctly
- Verify your anon key is correct in `.env`

### Data not showing up
- Go to Supabase Table Editor and check manually
- Check browser console for any error messages
- Verify your Supabase URL and key are correct

## Next Steps

Now you can integrate the registration form with Supabase by importing and using the service functions in your Header component.
