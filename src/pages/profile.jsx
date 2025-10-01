import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useData } from '../context/DataContext.jsx';

export default function MobileProfileScreen() {
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const { profile, loading, updateProfile, refreshProfile } = useData();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/portfolio'); // Always go back to portfolio from profile
  };

  // Initialize privacy mode from profile data
  useEffect(() => {
    if (profile) {
      setPrivacyMode(profile.privacyMode || false);
    }
  }, [profile]);

  // Periodically refresh profile data to get admin updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshProfile();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [refreshProfile]);

  // Update privacy mode
  const handlePrivacyToggle = async () => {
    const newPrivacyMode = !privacyMode;
    setPrivacyMode(newPrivacyMode);
    
    try {
      await updateProfile({
        ...profile,
        privacyMode: newPrivacyMode
      });
    } catch (error) {
      console.error('Error updating privacy mode:', error);
      // Revert on error
      setPrivacyMode(!newPrivacyMode);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900">
      {/* Header */}
      <div className="px-4 pt-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-1" onClick={handleBackClick}>
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="text-lg font-semibold">Profile</h1>
        </div>
        <button 
          onClick={refreshProfile}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Refresh Profile"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Top card */}
      <div className="px-4 mt-3">
        <div className="relative rounded-2xl border border-slate-200">
          <div className="p-4 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[17px] font-semibold">{profile?.name || 'Loading...'}</div>
                <div className="mt-1 text-[13px] text-slate-500">{profile?.userId || 'Loading...'}</div>
              </div>
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-slate-100 grid place-items-center text-slate-500 text-2xl font-semibold">{profile?.initials || 'AZ'}</div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1976d2] grid place-items-center shadow-md">
                  <Pencil className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-slate-200" />

          {/* Rows */}
          <div className="px-4">
            <RowLink label="Password & Security" value={<a href="#" className="text-[#1976d2] hover:underline">Manage</a>} />
          </div>

          <div className="h-[1px] bg-slate-200 mt-3" />

          <div className="px-4 py-3 space-y-3">
            <RowInline label="Support code" value={<a href="#" className="text-[#1976d2] hover:underline">{profile?.supportCode || 'View'}</a>} />
            <RowInline label="E-mail" value={<a href={`mailto:${profile?.email || ''}`} className="text-[#1976d2] hover:underline">{profile?.email || 'Loading...'}</a>} />
            <RowInline label="Phone" value={profile?.phone || 'Loading...'} />
            <RowInline label="PAN" value={profile?.pan || 'Loading...'} />
            <RowInline label="Demat (BO)" value={<a href="#" className="text-[#1976d2] hover:underline">{profile?.demat || 'Loading...'}</a>} />
            <div className="pt-2">
              <a href="#" className="text-[#1976d2] font-medium hover:underline">Manage account</a>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy mode */}
      <div className="px-4 mt-3">
        <div className="rounded-2xl border border-slate-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-slate-900">Privacy mode</span>
            <button
              onClick={() => setPrivacyMode(!privacyMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacyMode ? 'bg-[#1976d2]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacyMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bank accounts */}
      <div className="px-4 mt-3">
        <div className="rounded-2xl">
          <div className="px-4 py-3 text-[15px] font-semibold">Bank accounts</div>
          <div className="px-4 py-3">
            <RowInline label={profile?.bankAccount?.name || 'Loading...'} value={profile?.bankAccount?.number || 'Loading...'} />
          </div>
        </div>
      </div>

      {/* Segments */}
      <Section>
        <RowInline label="Segments" value={<a href="#" className="text-[#1976d2] hover:underline">{profile?.segments || 'Loading...'}</a>} />
        <RowInline label="Demat authorisation" value={<a href="#" className="text-[#1976d2] hover:underline">{profile?.dematerialization || 'Loading...'}</a>} />
      </Section>

      {/* Active sessions */}
      <div className="px-4 mt-3">
        <button onClick={() => setSessionsOpen(!sessionsOpen)} className="w-full rounded-2xl border border-slate-200 px-4 py-4 flex items-center justify-between">
          <a href="#" className="text-[#1976d2] font-medium hover:underline">View active sessions</a>
          <ChevronRight className={`w-5 h-5 text-slate-400 transition ${sessionsOpen ? "rotate-90" : ""}`} />
        </button>
      </div>

      {/* Account closure */}
      <div className="px-4 mt-3 mb-24">
        <div className="rounded-2xl border border-slate-200">
          <div className="px-4 py-3">
            <div className="text-[15px] font-semibold">Account closure</div>
          </div>
          <div className="h-[1px] bg-slate-200" />
                    <div className="px-4 py-3 text-[13px] text-slate-500">
            {profile?.accountClosureWarning || 'Loading...'}
          </div>
          <div className="px-4 pb-4">
            <a href="#" className="text-[#1976d2] font-medium hover:underline">Continue</a>
          </div>
        </div>
      </div>

      {/* iOS home indicator */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] bg-black/80 rounded-full" />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="px-4 mt-3">
      <div className="rounded-2xl border border-slate-200">
        {title && (
          <div className="px-4 py-3 text-[15px] font-semibold">{title}</div>
        )}
        <div className={`${title ? "h-[1px] bg-slate-200" : ""}`} />
        <div className="px-4 py-3 space-y-3">{children}</div>
      </div>
    </div>
  );
}

function RowLink({ label, value }) {
  return (
    <div className="w-full py-3 flex items-center justify-between">
      <span className="text-[15px] text-slate-500">{label}</span>
      {value}
    </div>
  );
}

function RowInline({ label, value }) {
  return (
    <div className="flex items-center justify-between text-[15px]">
      <span className={`text-slate-500 ${label ? "" : "invisible"}`}>{label || "placeholder"}</span>
      <div className="text-right text-slate-900">{value}</div>
    </div>
  );
}
