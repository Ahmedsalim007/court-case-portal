import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { caseApi } from '../api/caseApi';
import usePartyFields from '../hooks/usePartyFields';
import { validateCaseForm } from '../utils/validateCaseForm';
import PartyFieldsEditor from '../components/PartyFieldsEditor';

function CaseUpdatePage() {
  const { t } = useTranslation();
  const { caseNum } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const { parties, setParties, handlePartyChange, addParty, removeParty } =
    usePartyFields();
  const [hearingDate, setHearingDate] = useState('');
  const [assignedJudge, setAssignedJudge] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const hearingDateEditable = status === 'Registered';

  useEffect(() => {
    const fetchCase = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await caseApi.getCaseByCaseNum(caseNum);
        const data = res.data.data;

        setParties(data.parties.map((p) => ({ name: p.name, role: p.role })));
        setHearingDate(data.hearingDate.slice(0, 10));
        setAssignedJudge(data.assignedJudge);
        setStatus(data.status);
      } catch (err) {
        setLoadError(err.response?.data?.message || 'Failed to load case');
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [caseNum]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateCaseForm(
      { parties, hearingDate, assignedJudge },
      t
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        caseParties: parties,
        caseAssignedJudge: assignedJudge,
      };
   
      if (hearingDateEditable) {
        payload.caseHearingDate = hearingDate;
      }
      await caseApi.updateCase(caseNum, payload);
      navigate(`/cases/${caseNum}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update case');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-12 px-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-3 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-500 font-medium">
            {t('caseForm.loadingCase')}
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-4xl mx-auto mt-12 px-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        to={`/cases/${caseNum}`}
        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        {t('caseForm.backToCase')}
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mt-4 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                {t('caseForm.editCaseTitle')}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5 font-medium">
                {t('caseForm.caseNumber')}{' '}
                <span className="text-gray-700">{caseNum}</span>
              </p>
            </div>
            <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
              <span className="text-xs font-medium text-blue-700">
                {t('caseForm.editingBadge')}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {t('caseForm.assignedJudge')}
              </label>
              <input
                type="text"
                placeholder={t('caseForm.assignedJudgePlaceholder')}
                value={assignedJudge}
                onChange={(e) => setAssignedJudge(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {t('caseForm.hearingDate')}
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={hearingDate}
                onChange={(e) => setHearingDate(e.target.value)}
                disabled={!hearingDateEditable}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
              {!hearingDateEditable && (
                <p className="text-xs text-gray-400 mt-1.5">
                  {t('caseForm.hearingDateLocked')}
                </p>
              )}
            </div>
          </div>

          <div className="px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('caseForm.parties')}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t('caseForm.partyCount', { count: parties.length })}
                </p>
              </div>
            </div>
            <PartyFieldsEditor
              parties={parties}
              onPartyChange={handlePartyChange}
              onAddParty={addParty}
              onRemoveParty={removeParty}
            />
          </div>

          {error && (
            <div className="px-8 pt-2">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="px-8 py-6 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link
              to={`/cases/${caseNum}`}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('caseForm.cancel')}
            </Link>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {submitting ? t('caseForm.saving') : t('caseForm.saveSubmit')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CaseUpdatePage;