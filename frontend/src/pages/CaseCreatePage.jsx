import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { caseApi } from '../api/caseApi';
import usePartyFields from '../hooks/usePartyFields';
import { validateCaseForm } from '../utils/validateCaseForm';
import PartyFieldsEditor from '../components/PartyFieldsEditor';

function CaseCreatePage() {
  const { t } = useTranslation();
  const { parties, handlePartyChange, addParty, removeParty } =
    usePartyFields();
  const [hearingDate, setHearingDate] = useState('');
  const [assignedJudge, setAssignedJudge] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

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
      const res = await caseApi.createCase({
        caseParties: parties,
        caseHearingDate: hearingDate,
        caseAssignedJudge: assignedJudge,
      });
      navigate(`/cases`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create case');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-6 pb-10">
      <Link to="/cases" className="text-md text-gray-600 hover:text-gray-700">
        {t('caseForm.backToCase')}
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 mt-4 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('caseForm.newCaseTitle')}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 grid grid-cols-2 gap-x-10 gap-y-5">
            <div>
              <p className="text-xs text-gray-400 uppercase mb-1">
                {t('caseForm.assignedJudge')}
              </p>
              <input
                type="text"
                placeholder={t('caseForm.assignedJudgePlaceholder')}
                value={assignedJudge}
                onChange={(e) => setAssignedJudge(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase mb-1">
                {t('caseForm.hearingDate')}
              </p>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={hearingDate}
                onChange={(e) => setHearingDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="px-8 py-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase mb-3">
              {t('caseForm.parties')}
            </p>
            <PartyFieldsEditor
              parties={parties}
              onPartyChange={handlePartyChange}
              onAddParty={addParty}
              onRemoveParty={removeParty}
            />
          </div>

          {error && (
            <div className="px-8 pb-2">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? t('caseForm.creating') : t('caseForm.createSubmit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CaseCreatePage;
