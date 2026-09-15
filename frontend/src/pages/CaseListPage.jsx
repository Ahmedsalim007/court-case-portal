import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { caseApi } from '../api/caseApi';
import CaseCard from '../components/CaseCard';
import CaseStatsPanel from '../components/CaseStatsPanel';
import CaseFilters from '../components/CaseFilters';
import useDebounce from '../hooks/useDebounce';
import { Link } from 'react-router-dom';

function CaseListPage() {
  const { t } = useTranslation();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    judge: '',
    fromDate: '',
    toDate: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedJudge = useDebounce(filters.judge, 600);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await caseApi.getCases({
          search: debouncedSearch,
          status: filters.status,
          judge: debouncedJudge,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          page,
          limit: 10,
        });
        setCases(res.data.data);
        setTotalPages(res.data.totalPages);
        setHasNextPage(res.data.hasNextPage);
        setHasPrevPage(res.data.hasPrevPage);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load cases');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [debouncedSearch, filters.status, debouncedJudge, filters.fromDate, filters.toDate, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
    
        <div className="flex-1 min-w-0">
       
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              {t('cases.title')}
            </h1>
            <Link
              to="/cases/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm whitespace-nowrap"
            >
              <span className="text-lg leading-none">+</span>
              {t('cases.newCase')}
            </Link>
          </div>

          <div className="flex flex-row gap-3 mb-5">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('cases.searchPlaceholder')}
                value={search}
                onChange={handleSearchChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow placeholder:text-gray-400"
              />
            </div>
            <CaseFilters initialFilters={filters} onFilterChange={handleFilterChange} />
          </div>

          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-gray-500 font-medium">{t('cases.loading')}</p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && cases.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{t('cases.noCasesFound')}</p>
              <p className="text-gray-400 text-sm mt-1">{t('cases.tryAdjusting')}</p>
            </div>
          )}


          {!loading && !error && cases.length > 0 && (
            <>
              <div className="flex flex-col gap-2">
                {cases.map((c) => (
                  <CaseCard key={c._id} caseItem={c} />
                ))}
              </div>
              <div className="lg:hidden mt-8">
              <CaseStatsPanel collapsible />
            </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!hasPrevPage}
                  className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {t('cases.previous')}
                </button>
                <span className="text-sm text-gray-600 font-medium">
                  {t('cases.pageOf', { page, totalPages })}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNextPage}
                  className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {t('cases.next')}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="hidden lg:block w-full lg:w-72 flex-shrink-0">
          <CaseStatsPanel />
        </div>
      </div>
    </div>
  );
}

export default CaseListPage;