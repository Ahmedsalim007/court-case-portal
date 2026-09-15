import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { caseApi } from '../api/caseApi';
import { VALID_TRANSITIONS as validTransitions } from '../constants/caseConstants';
import StatusBadge from '../components/StatusBadge';
import StatusTracker from '../components/StatusTracker';

function CaseDetailPage() {
  const { t, i18n } = useTranslation();
  const { caseNum } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCase = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await caseApi.getCaseByCaseNum(caseNum);
        setCaseData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load case');
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [caseNum]);

  const handleStatusChange = async (newStatus) => {
    const confirmed = window.confirm(
      t('caseDetail.statusChangeConfirm', { status: t(`status.${newStatus}`, newStatus) })
    );
    if (!confirmed) return;

    setActionError(null);
    setUpdating(true);
    try {
      const res = await caseApi.updateCase(caseNum, { status: newStatus });
      setCaseData(res.data.data);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false); 
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(t('caseDetail.deleteConfirm', { caseNum }));
    if (!confirmed) return;

    setActionError(null);
    setDeleting(true);
    try {
      await caseApi.deleteCase(caseNum);
      navigate('/cases');
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete case');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500 font-medium">{t('caseDetail.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!caseData) return null;

  const nextStatuses = validTransitions[caseData.status] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Link
          to="/cases"
          className="inline-flex items-center gap-2 text-md text-gray-600 hover:text-gray-900 mb-4 font-medium"
        >
          {t('caseDetail.backToCases')}
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {caseData.caseNum}
          </h1>
          <StatusBadge status={caseData.status} />
        </div>

        <StatusTracker status={caseData.status} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              {t('caseDetail.caseInformation')}
            </p>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-gray-400 font-medium">{t('caseDetail.assignedJudge')}</p>
                <p className="text-sm text-gray-900 mt-1 font-medium">{caseData.assignedJudge}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{t('caseDetail.hearingDate')}</p>
                <p className="text-sm text-gray-900 mt-1 font-medium">
                  {new Date(caseData.hearingDate).toLocaleDateString(i18n.language, {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'UTC',

                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              {t('caseDetail.parties')}
            </p>
            <div className="flex flex-col gap-3">
              {caseData.parties.map((party, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-900 font-medium">{party.name}</span>
                  <span className="text-gray-400 text-xs font-medium">{t(`role.${party.role}`, party.role)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {actionError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm text-red-700 font-medium">{actionError}</p>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            {nextStatuses.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={updating}
                className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {updating ? t('caseDetail.updating') : t('caseDetail.moveTo', { status: t(`status.${status}`, status) })}
              </button>
            ))}

            <Link
              to={`/cases/${caseNum}/edit`}
              className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              {t('caseDetail.editCase')}
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition ms-auto"
            >
              {deleting ? t('caseDetail.deleting') : t('caseDetail.deleteCase')}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-2 px-1 text-xs text-gray-400">
          <span className="font-medium">
            {t('caseDetail.createdBy', { name: caseData.createdBy?.fullName || t('caseDetail.unknown') })}
          </span>
          <span className="font-medium">
            {t('caseDetail.updatedBy', { name: caseData.updatedBy?.fullName || t('caseDetail.unknown') })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CaseDetailPage;