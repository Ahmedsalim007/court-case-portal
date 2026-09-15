import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineFunnel } from 'react-icons/hi2';
import { STATUS_ORDER } from '../constants/caseConstants';

const emptyFilters = { status: '', judge: '', fromDate: '', toDate: '' };

function CaseFilters({ initialFilters, onFilterChange }) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState(initialFilters || emptyFilters);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const updateFilter = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters =
    filters.status || filters.judge || filters.fromDate || filters.toDate;

  return (
    <div className="relative shrink-0" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title={t('filters.button')}
        aria-label={t('filters.button')}
        className={`relative flex items-center justify-center px-3 py-2.5 border rounded-lg transition ${
          hasActiveFilters
            ? 'border-blue-500 text-blue-600 bg-blue-50'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <HiOutlineFunnel className="h-4 w-4" />
        {hasActiveFilters && (
          <span className="absolute -top-1 -end-1 h-2 w-2 rounded-full bg-blue-600" />
        )}
      </button>

      {open && (
        <div className="absolute end-0 mt-2 w-[min(16rem,calc(100vw-3rem))] bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-10">
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {t('filters.status')}
              </label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('filters.allStatuses')}</option>
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{t(`status.${s}`, s)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {t('filters.judge')}
              </label>
              <input
                type="text"
                placeholder={t('filters.judgePlaceholder')}
                value={filters.judge}
                onChange={(e) => updateFilter('judge', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {t('filters.fromDate')}
              </label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => updateFilter('fromDate', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {t('filters.toDate')}
              </label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => updateFilter('toDate', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-800 text-left pt-3 border-t border-gray-100 font-medium"
              >
                {t('filters.clearAll')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseFilters;
