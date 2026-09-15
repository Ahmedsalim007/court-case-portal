import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineUsers } from 'react-icons/hi2';
import { userApi } from '../api/userApi';

function AdminUserListPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userApi.getUsers();
      setUsers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || t('users.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (employeeId) => {
    if (!window.confirm(t('users.confirmDelete'))) return;
    try {
      await userApi.deleteUser(employeeId);
      setUsers((prev) => prev.filter((u) => u.employeeId !== employeeId));
    } catch (err) {
      setError(err.response?.data?.message || t('users.deleteFailed'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-16 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {t('users.title')}
          </h1>
          <Link
            to="/admin/users/create"
            className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <HiOutlinePlus className="h-4 w-4" />
            {t('users.createUser')}
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {loading ? (
            <p className="text-sm text-gray-500 p-6">{t('users.loading')}</p>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
              <HiOutlineUsers className="h-8 w-8" />
              <p className="text-sm">{t('users.noUsersFound')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[520px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {t('users.fullName')}
                  </th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {t('users.employeeId')}
                  </th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {t('roleLabel')}
                  </th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.employeeId} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-6 text-sm text-gray-900">{u.fullName}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{u.employeeId}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{u.role}</td>
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => handleDelete(u.employeeId)}
                        title={t('users.delete')}
                        aria-label={t('users.delete')}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                        {t('users.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUserListPage;