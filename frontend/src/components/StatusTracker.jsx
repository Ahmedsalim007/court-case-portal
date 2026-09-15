import { STATUS_ORDER as statusSteps } from '../constants/caseConstants';
import { useTranslation } from 'react-i18next';

function StatusTracker({ status }) {
  const { t } = useTranslation();
  const currentStatusIndex = statusSteps.indexOf(status);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      {/* Mobile: vertical stepper */}
      <div className="flex flex-col gap-1 sm:hidden">
        {statusSteps.map((step, index) => {
          const completed = index <= currentStatusIndex;
          const isLast = index === statusSteps.length - 1;
          return (
            <div key={step} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
                    completed ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 min-h-[1.25rem] my-1 ${
                      index < currentStatusIndex ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-sm pt-1.5 pb-3 ${
                  completed ? 'text-gray-900 font-semibold' : 'text-gray-400 font-medium'
                }`}
              >
                {t(`status.${step}`, step)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tablet/desktop: horizontal stepper */}
      <div className="hidden sm:flex items-center">
        {statusSteps.map((step, index) => {
          const completed = index <= currentStatusIndex;
          const isLast = index === statusSteps.length - 1;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
                    completed
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-xs mt-2 text-center ${
                    completed ? 'text-gray-900 font-semibold' : 'text-gray-400 font-medium'
                  }`}
                >
                  {t(`status.${step}`, step)}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`h-0.5 flex-1 mx-3 ${
                    index < currentStatusIndex ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatusTracker;
