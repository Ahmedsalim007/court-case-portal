import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineFolder,
  HiOutlineUsers,
  HiOutlineLanguage,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';


function NavLinks({ isAdmin, t }) {
  return (
    <div className="flex items-center gap-7">
      <Link
        to="/cases"
        className="flex items-center gap-1.5 text-sm font-medium text-slate-300 transition hover:text-white"
      >
        <HiOutlineFolder className="h-4 w-4" />
        {t('nav.cases')}
      </Link>

      
      {isAdmin && (
        <Link
          to="/admin/users"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-300 transition hover:text-white"
        >
          <HiOutlineUsers className="h-4 w-4" />
          {t('nav.manageUsers')}
        </Link>
      )}
    </div>
  );
}

// --- EN / AR switch ---
function LanguageToggle({ language, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 text-sm font-medium text-slate-300 transition hover:text-white"
    >
      <HiOutlineLanguage className="h-4 w-4" />
      {language === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}

function UserMenu({ fullName, onLogout, logoutLabel }) {
  return (
    <div className="flex items-center gap-3 ms-auto ps-5 border-s border-slate-700">
      <span className="text-sm font-medium text-slate-200">{fullName}</span>

      <button
        onClick={onLogout}
        title={logoutLabel}
        aria-label={logoutLabel}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
      >
        <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
      </button>
    </div>
  );
}

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isAdmin = user?.role === 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <nav className="bg-slate-900 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center">
        <span className="text-lg font-bold text-white">{t('app.title')}</span>

 
        <div className="flex items-center gap-7 ms-8">
          {isAuthenticated && <NavLinks isAdmin={isAdmin} t={t} />}
          <LanguageToggle language={i18n.language} onToggle={toggleLanguage} />
        </div>

        {isAuthenticated && (
          <UserMenu
            fullName={user?.fullName}
            onLogout={handleLogout}
            logoutLabel={t('nav.logout')}
          />
        )}
      </div>
    </nav>
  );
}

export default Navbar;