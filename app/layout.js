import './globals.css';

import SiteChrome from '../components/SiteChrome';
import BacksoundPlayer from '../components/BacksoundPlayer';
import FeedbackButton from '../components/FeedbackButton';

import { getSession } from '../lib/auth';
import { getSettings } from '../lib/settings';
import { recordLoginDay } from '../lib/streak';
import { supabaseAdmin } from '../lib/supabaseAdmin';

export const metadata = {
  title: 'DramaVers',
  description: 'Kumpulan klip Asia, Western, JKT48, KPOP, Anime',
};

export default async function RootLayout({ children }) {
  const session = getSession();

  // Sesi (JWT) tidak menyimpan foto profil, jadi ambil dari database untuk navbar
  let navSession = session;
  if (session) {
    await recordLoginDay(session.id);
    try {
      const { data } = await supabaseAdmin()
        .from('users')
        .select('avatar_url')
        .eq('id', session.id)
        .maybeSingle();
      navSession = { ...session, avatar_url: data?.avatar_url || null };
    } catch {}
  }

  const settings = await getSettings([
    'backsound_enabled',
    'backsound_url',
  ]);

  return (
    <html lang="id">
      <body>
        <SiteChrome session={navSession}>
          {children}
        </SiteChrome>

        <BacksoundPlayer
          enabled={settings.backsound_enabled === 'true'}
          url={settings.backsound_url}
        />

        <FeedbackButton />
      </body>
    </html>
  );
}
