import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
      setError(err.response?.data?.message || t('fetchUsersFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (employeeId) => {
    if (!window.confirm(t('confirmDeleteUser'))) return;
    try {
      await userApi.deleteUser(employeeId);
      setUsers((prev) => prev.filter((u) => u.employeeId !== employeeId));
    } catch (err) {
      setError(err.response?.data?.message || t('deleteUserFailed'));
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t('users')}</h1>
        <Link
          to="/admin/users/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t('createUser')}
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p>{t('loading')}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">{t('fullName')}</th>
              <th className="py-2">{t('employeeId')}</th>
              <th className="py-2">{t('roleLabel')}</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.employeeId} className="border-b">
                <td className="py-2">{u.fullName}</td>
                <td className="py-2">{u.employeeId}</td>
                <td className="py-2">{u.role}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => handleDelete(u.employeeId)}
                    className="text-red-600 hover:underline"
                  >
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminUserListPage;