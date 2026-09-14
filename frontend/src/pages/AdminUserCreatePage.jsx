
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { userApi } from '../api/userApi';

function AdminUserCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Clerk');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !employeeId.trim() || !password.trim()) {
      setError(t('users.requiredError'));
      return;
    }

    if (!/^[A-Za-z\u0600-\u06FF\s.\-']+$/.test(fullName.trim())) {
      setError(t('users.nameError'));
      return;
    }

    if (!/^\d{1,6}$/.test(employeeId.trim())) {
      setError(t('users.idError'));
      return;
    }

    if (password.length < 6) {
      setError(t('users.passwordLengthError'));
      return;
    }

    setLoading(true);
    try {
      await userApi.createUser({
        fullName: fullName.trim(),
        employeeId: employeeId.trim(),
        password,
        role,
      });
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || t('users.createUserFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-6 pt-16 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {t('users.createUser')}
          </h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {t('users.fullName')}
                </label>
                <input
                  type="text"
                  placeholder={t('users.fullNamePlaceholder')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {t('users.employeeId')}
                </label>
                <input
                  type="text"
                  placeholder={t('users.employeeIdPlaceholder')}
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {t('users.password')}
                </label>
                <input
                  type="password"
                  placeholder={t('users.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {t('roleLabel')}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                >
                  <option value="Clerk">{t('role.Clerk', 'Clerk')}</option>
                  <option value="Admin">{t('role.Admin', 'Admin')}</option>
                </select>
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
                {loading ? t('users.submitting') : t('users.createUser')}
              </button>
            </div>
          </form>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          <Link to="/admin/users" className="text-blue-600 font-medium hover:text-blue-800">
            {t('users.backToUsers')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminUserCreatePage;