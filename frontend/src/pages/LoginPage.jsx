import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

function LoginPage() {
  const { t } = useTranslation();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('sessionExpired') === 'true';

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!employeeId.trim() || !password.trim()) {
      setError(t('login.requiredError'));
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login({ employeeId, password });
      login(response.data.token);
      navigate('/cases');
    } catch (err) {
      setError(err.response?.data?.message || t('login.submit') + ' failed');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-50 flex items-start justify-center px-6 pt-16 pb-12">

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {t('login.title')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('login.subtitle')}
          </p>
        </div>

        {sessionExpired && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-sm text-yellow-800">{t('login.sessionExpired')}</p>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {t('login.employeeId')}
                </label>
                <input
                  type="text"
                  placeholder={t('login.employeeIdPlaceholder')}
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {t('login.password')}
                </label>
                <input
                  type="password"
                  placeholder={t('login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-5 border-t border-gray-200 bg-gray-50/50">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                {loading ? t('login.submitting') : t('login.submit')}
              </button>
            </div>
          </form>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          {t('login.noAccount')}{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:text-blue-800">
            {t('login.registerLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;