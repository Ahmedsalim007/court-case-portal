import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineScale,
  HiOutlineFolder,
  HiOutlineUsers,
  HiOutlineLanguage,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
} from 'react-icons/hi2';

const linkClass = ({ isActive }) =>
  `flex items-center gap-1.5 text-sm font-medium transition ${
    isActive ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
  }`;


function NavLinks({ isAdmin, t }) {
  return (
    <>
      <NavLink to="/cases" className={linkClass}>
        <HiOutlineFolder className="h-4 w-4" />
        {t('nav.cases')}
      </NavLink>

      {isAdmin && (
        <NavLink to="/admin/users" className={linkClass}>
          <HiOutlineUsers className="h-4 w-4" />
          {t('nav.manageUsers')}
        </NavLink>
      )}
    </>
  );
}


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
    <div className="flex items-center gap-3 ps-5 border-s border-slate-700">
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'Admin';

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <nav className="bg-slate-900 px-6 py-4 shadow-sm relative">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand — stands alone, nothing crowding it */}
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white">
          <HiOutlineScale className="h-5 w-5 text-slate-400" />
          {t('app.title')}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {isAuthenticated && <NavLinks isAdmin={isAdmin} t={t} />}
          <LanguageToggle language={i18n.language} onToggle={toggleLanguage} />
          {isAuthenticated && (
            <UserMenu
              fullName={user?.fullName}
              onLogout={handleLogout}
              logoutLabel={t('nav.logout')}
            />
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:bg-slate-800 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiOutlineXMark className="h-5 w-5" /> : <HiOutlineBars3 className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden max-w-5xl mx-auto mt-4 flex flex-col gap-4 border-t border-slate-800 pt-4">
          {isAuthenticated && <NavLinks isAdmin={isAdmin} t={t} />}
          <LanguageToggle language={i18n.language} onToggle={toggleLanguage} />
          {isAuthenticated && (
            <UserMenu
              fullName={user?.fullName}
              onLogout={handleLogout}
              logoutLabel={t('nav.logout')}
            />
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;