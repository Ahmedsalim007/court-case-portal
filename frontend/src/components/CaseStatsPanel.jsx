import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { STATUS_ORDER as statusOrder } from '../constants/caseConstants';
import { statsApi } from '../api/caseStatsApi';
import { HiOutlineChevronDown } from 'react-icons/hi2';

const statusStyles = {
  Registered: { dot: 'bg-blue-500', text: 'text-gray-700' },
  'In Hearing': { dot: 'bg-yellow-500', text: 'text-gray-700' },
  Judgment: { dot: 'bg-purple-500', text: 'text-gray-700' },
  Closed: { dot: 'bg-green-500', text: 'text-gray-700' },
};

function CaseStatsPanel({ collapsible = false }) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(collapsible);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await statsApi.getCaseStats();
        setStats(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${!collapsible ? 'sticky top-6' : ''}`}>
      <button
        type="button"
        onClick={() => collapsible && setCollapsed((c) => !c)}
        className={`w-full flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50/50 text-left ${
          collapsible ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <div>
          <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
            {t('stats.overview')}
          </h3>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            {t('stats.byStatus')}
          </p>
        </div>
        {collapsible && (
          <HiOutlineChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          />
        )}
      </button>

      {!collapsed && (
      <div className="p-5">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-3 border-blue-600 border-t-transparent"></div>
              <p className="text-xs text-gray-400 font-medium">
                {t('stats.loading')}
              </p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-red-600 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && stats?.counts && (
          <>
            <div className="space-y-3">
              {statusOrder.map((statusName) => {
                const count = stats.counts[statusName] || 0;
                const style = statusStyles[statusName];

                return (
                  <div
                    key={statusName}
                    className="flex justify-between items-center group hover:bg-gray-50/70 -mx-1 px-1 py-1.5 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${style?.dot || 'bg-gray-400'} ring-1 ring-black/5`}
                        />
                        {count > 0 && (
                          <span
                            className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${style?.dot || 'bg-gray-400'} animate-pulse`}
                          />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${style?.text || 'text-gray-600'}`}
                      >
                        {t(`status.${statusName}`, statusName)}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        count > 0 ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  {t('stats.total')}
                </span>
                <span className="text-lg font-bold text-gray-900 tabular-nums">
                  {stats.total}
                </span>
              </div>

              {stats.total > 0 && (
                <div className="mt-3 flex gap-1 h-1">
                  {statusOrder.map((statusName) => {
                    const count = stats.counts[statusName] || 0;
                    const percentage = (count / stats.total) * 100;
                    const style = statusStyles[statusName];

                    return (
                      <div
                        key={statusName}
                        className={`rounded-full ${style?.dot || 'bg-gray-400'} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                        title={`${t(`status.${statusName}`, statusName)}: ${percentage.toFixed(1)}%`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      )}
    </div>
  );
}

export default CaseStatsPanel;