import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const isSupabaseConfigured =
    supabaseUrl &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey &&
    supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here';

  let isAuthenticated = false;
  let userEmail = 'sandbox@auren.com';

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        isAuthenticated = true;
        userEmail = user.email || 'admin@auren.com';
      }
    } catch (e) {
      console.error('Auth verification failed, using cookie fallback check:', e);
    }
  } else {
    const cookieStore = await cookies();
    isAuthenticated = cookieStore.get('mock-admin-session')?.value === 'true';
  }

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-brand-cream text-brand-charcoal">
      <AdminSidebar userEmail={userEmail} />
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
