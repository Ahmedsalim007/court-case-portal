import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StatusBadge from './StatusBadge';

function CaseCard({ caseItem }) {
  const { t, i18n } = useTranslation();
  const plaintiffs = caseItem.parties.filter((p) => p.role === 'Plaintiff');
  const defendants = caseItem.parties.filter((p) => p.role === 'Defendant');

  const plaintiffNames = plaintiffs.map((p) => p.name).join(', ') || t('caseDetail.unknown');
  const defendantNames = defendants.map((d) => d.name).join(', ') || t('caseDetail.unknown');

  return (
    <Link
      to={`/cases/${caseItem.caseNum}`}
      className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-center mb-3">
        <span dir="ltr" className="font-mono text-sm  text-gray-600">
          {caseItem.caseNum}
        </span>
        <StatusBadge status={caseItem.status} />
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-3">
        {plaintiffNames} <span className="text-gray-400 font-normal text-md mx-.5">{t('caseCard.vs')}</span> {defendantNames}
      </h3>

      <div className="flex items-center gap-10 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <span className="text-gray-400">{t('caseCard.judge')}</span> {caseItem.assignedJudge}
        </span>
        
        <span className="flex items-center gap-1">
          <span className="text-gray-400">{t('caseCard.hearing')}</span>{' '}
          {new Date(caseItem.hearingDate).toLocaleDateString(i18n.language, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </Link>
  );
}

export default CaseCard;