import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !employeeId.trim() || !password.trim()) {
      setError(t('register.requiredError'));
      return;
    }

    if (!/^[A-Za-z\u0600-\u06FF\s.\-']+$/.test(fullName.trim())) {
      setError(t('register.nameError'));
      return;
    }

    if (!/^\d{1,6}$/.test(employeeId.trim())) {
      setError(t('register.idError'));
      return;
    }

    if (password.length < 6) {
      setError(t('register.passwordLengthError'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('register.passwordMatchError'));
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.register({ fullName, employeeId, password });
      login(response.data.token);
      navigate('/cases');
    } catch (err) {
      setError(err.response?.data?.message || t('register.submit') + ' failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-6 pt-16 pb-12">

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {t('register.title')}
          </h1>
        
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {t('register.fullName')}
                </label>
                <input
                  type="text"
                  placeholder={t('register.fullNamePlaceholder')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {t('register.employeeId')}
                </label>
                <input
                  type="text"
                  placeholder={t('register.employeeIdPlaceholder')}
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    {t('register.password')}
                  </label>
                  <input
                    type="password"
                    placeholder={t('register.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    {t('register.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    placeholder={t('register.confirmPasswordPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
                  />
                </div>
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
                {loading ? t('register.submitting') : t('register.submit')}
              </button>
            </div>
          </form>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          {t('register.haveAccount')}{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800">
            {t('register.loginLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;