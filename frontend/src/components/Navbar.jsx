
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <nav className="bg-slate-900 px-6 py-4 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center">
        
        <span className="text-lg font-bold text-white">
          {t('app.title')}
        </span>

       
        <div className="flex items-center gap-7 ms-auto">
          {isAuthenticated && (
            <>
              <Link
                to="/cases"
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                {t('nav.cases')}
              </Link>

              {user?.role === 'Admin' && (
                <Link
                  to="/admin/users"
                  className="text-sm font-medium text-slate-300 transition hover:text-white"
                >
                  {t('nav.manageUsers')}
                </Link>
              )}
            </>
          )}

          {/* Language */}
          <button
            onClick={toggleLanguage}
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            {i18n.language === 'ar' ? 'English' : 'العربية'}
          </button>

          {/* User */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 ms-2 ps-5 border-s border-slate-700">
              <span className="text-sm font-medium text-slate-200">
                {user?.fullName}
              </span>

              <button
                onClick={handleLogout}
                title={t('nav.logout')}
                aria-label={t('nav.logout')}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
              >
                {/* Logout icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 12H9m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
