import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineScale,
  HiOutlineFolder,
  HiOutlineUsers,
  HiOutlineLanguage,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChevronDown,
  HiOutlineBars3,
  HiOutlineXMark,
} from 'react-icons/hi2';

const linkClass = (mobile) => ({ isActive }) =>
  `flex items-center gap-2 text-sm font-medium transition rounded-lg ${
    mobile ? 'px-3 py-2.5' : ''
  } ${
    isActive
      ? mobile ? 'bg-slate-800 text-white font-semibold' : 'text-white font-semibold'
      : mobile ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-300 hover:text-white'
  }`;

function NavLinks({ isAdmin, t, mobile }) {
  return (
    <>
      <NavLink to="/cases" className={linkClass(mobile)}>
        <HiOutlineFolder className="h-4 w-4" />
        {t('nav.cases')}
      </NavLink>

      {isAdmin && (
        <NavLink to="/admin/users" className={linkClass(mobile)}>
          <HiOutlineUsers className="h-4 w-4" />
          {t('nav.manageUsers')}
        </NavLink>
      )}
    </>
  );
}

function LanguageToggle({ language, onToggle, mobile }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 text-sm font-medium text-slate-300 transition rounded-lg hover:text-white ${
        mobile ? 'px-3 py-2.5 hover:bg-slate-800' : ''
      }`}
    >
      <HiOutlineLanguage className="h-4 w-4" />
      {language === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}

function UserMenu({ fullName, onLogout, logoutLabel, mobile }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg">
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

// --- Desktop-only: name click opens language + logout ---
function UserDropdown({ fullName, language, onToggleLanguage, onLogout, logoutLabel }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative ps-5 border-s border-slate-700">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-slate-200 rounded-lg px-2 py-1.5 transition hover:bg-slate-800"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-200">
          {fullName?.charAt(0)?.toUpperCase()}
        </span>
        {fullName}
        <HiOutlineChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute end-0 mt-2 w-48 rounded-lg border border-slate-800 bg-slate-900 shadow-lg py-1 z-10">
          <button
            onClick={() => { onToggleLanguage(); setOpen(false); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <HiOutlineLanguage className="h-4 w-4" />
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
          <button
            onClick={() => { onLogout(); setOpen(false); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
            {logoutLabel}
          </button>
        </div>
      )}
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
        <div className="flex items-center gap-2 text-lg font-bold text-white">
          <HiOutlineScale className="h-5 w-5 text-slate-400" />
          {t('app.title')}
        </div>

        {/* Desktop nav — links visible, language + logout tucked in dropdown */}
        <div className="hidden md:flex items-center gap-8">
          {isAuthenticated && <NavLinks isAdmin={isAdmin} t={t} />}
          {isAuthenticated ? (
            <UserDropdown
              fullName={user?.fullName}
              language={i18n.language}
              onToggleLanguage={toggleLanguage}
              onLogout={handleLogout}
              logoutLabel={t('nav.logout')}
            />
          ) : (
            <LanguageToggle language={i18n.language} onToggle={toggleLanguage} />
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
        <div className="md:hidden max-w-5xl mx-auto mt-3 border-t border-slate-800 pt-3">
          {isAuthenticated && (
            <div className="flex flex-col gap-1 pb-3 mb-3 border-b border-slate-800">
              <NavLinks isAdmin={isAdmin} t={t} mobile />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <LanguageToggle language={i18n.language} onToggle={toggleLanguage} mobile />
            {isAuthenticated && (
              <UserMenu
                fullName={user?.fullName}
                onLogout={handleLogout}
                logoutLabel={t('nav.logout')}
                mobile
              />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;