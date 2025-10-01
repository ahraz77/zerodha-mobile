import React from 'react';
import { useNavigate } from 'react-router-dom';
import feather from 'feather-icons';
import { useNavigation } from '../context/NavigationContext.jsx';

// ---------- Feather helpers ----------
function Icon({ name, className = '', strokeWidth = 2, size = 24 }) {
  const icon = feather.icons[name];
  if (!icon) return null;
  const svg = icon.toSvg({ width: String(size), height: String(size), class: className, 'stroke-width': String(strokeWidth) });
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function InviteFriends() {
  const navigate = useNavigate();
  const { goBack } = useNavigation();

  const handleBackClick = () => {
    console.log('Invite Friends - Back button clicked');
    alert('Invite Friends - Back button clicked');
    navigate('/portfolio'); // Always go back to portfolio from invite friends
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 pt-4">
      {/* Top bar */}
      <div className="flex items-center mb-6">
        <button onClick={handleBackClick} className="p-2 -ml-1 rounded-full hover:bg-gray-100 active:scale-95 transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">Invite friends</h1>
        <div className="w-6"></div>
      </div>

      {/* Illustration */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/images/gift_invite.png"
          alt="Gift invitation illustration"
          className="w-32 h-32 object-contain select-none"
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col items-center text-center px-4 mb-8">
        <p className="text-base sm:text-lg font-medium text-gray-900">
          Refer your friends and family and earn <br className="hidden sm:block" />300 reward points for each referral!
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Redeem reward points to subscribe to our paid services or get free AMC.
        </p>
        <a href="#" className="text-blue-600 text-sm font-medium mt-2 hover:underline">Learn more</a>
      </div>

      {/* Share button */}
      <div className="w-full max-w-sm mx-auto">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-center tracking-wide transition-colors">
          Share
        </button>
      </div>
    </div>
  );
}