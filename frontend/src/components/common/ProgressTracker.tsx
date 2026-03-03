import { useUserJourney } from '../../context/UserJourneyStore';
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { GlassCard } from './GlassCard';

export const ProgressTracker = () => {
  const { steps, currentStep, xpPoints, level } = useUserJourney();

  return (
    <GlassCard className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Journey Progress</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Level {level} • {xpPoints} XP</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round((steps.filter(s => s.completed).length / steps.length) * 100)}%
          </div>
          <div className="text-sm text-gray-500">Complete</div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        <div 
          className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600 transition-all duration-1000"
          style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-center">
              <div className={`
                relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                ${step.completed 
                  ? 'bg-green-500 text-white' 
                  : index === currentStep 
                    ? 'bg-blue-500 text-white animate-pulse' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                }
              `}>
                {step.completed ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : index > currentStep ? (
                  <LockClosedIcon className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
              
              <div className="ml-4 flex-1">
                <h4 className={`font-medium ${
                  step.completed ? 'text-green-600 dark:text-green-400' : 
                  index === currentStep ? 'text-blue-600 dark:text-blue-400' : 
                  'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>

              {step.score && (
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{step.score}%</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};