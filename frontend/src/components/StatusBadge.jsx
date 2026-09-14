import { useTranslation } from 'react-i18next';

const statusStyles = {
  Registered: 'bg-blue-100 text-blue-800',
  'In Hearing': 'bg-yellow-100 text-yellow-800',
  Judgment: 'bg-purple-100 text-purple-800',
  Closed: 'bg-green-100 text-green-800',
};

function StatusBadge({ status }) {
  const { t } = useTranslation();
  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-sm ${style}`}>
      {t(`status.${status}`, status)}
    </span>
  );
}

export default StatusBadge;