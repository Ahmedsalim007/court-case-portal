import { useTranslation } from 'react-i18next';
import { PARTY_ROLES as roles } from '../constants/caseConstants';

function PartyFieldsEditor({ parties, onPartyChange, onAddParty, onRemoveParty }) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {parties.map((party, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 hover:border-blue-300 transition-colors bg-white"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-xs font-medium text-gray-400">
                {t('caseForm.partyLabel', { num: index + 1 })}
              </span>
              {parties.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveParty(index)}
                  className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                >
                  {t('caseForm.remove')}
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder={t('caseForm.fullNamePlaceholder')}
              value={party.name}
              onChange={(e) => onPartyChange(index, 'name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
            />

            <select
              value={party.role}
              onChange={(e) => onPartyChange(index, 'role', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {t(`role.${r}`, r)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddParty}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        {t('caseForm.addParty')}
      </button>
    </div>
  );
}

export default PartyFieldsEditor;