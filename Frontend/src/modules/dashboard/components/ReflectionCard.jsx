import { Calendar, Eye, Sparkles } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const ReflectionCard = ({ reflection, onViewDetails }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { day: 'numeric' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.toLocaleDateString('en-US', { year: 'numeric' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
    };
  };

  const dateInfo = formatDate(reflection.reflectionDate);

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
      {/* Date Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-12 -mt-12"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">{dateInfo.day} {dateInfo.month}</p>
              <p className="text-indigo-100 text-xs">{dateInfo.weekday}, {dateInfo.year}</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Day Summary</p>
          </div>
          <p className="text-gray-800 line-clamp-3 text-sm leading-relaxed">{reflection.daySummary}</p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Proud Moment</p>
          </div>
          <p className="text-gray-800 line-clamp-2 text-sm leading-relaxed">{reflection.proudMoment}</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-5 pb-5">
        <Button 
          variant="outline" 
          size="sm" 
          fullWidth
          onClick={() => onViewDetails(reflection)}
          className="group-hover:bg-indigo-50 group-hover:border-indigo-300 group-hover:text-indigo-700 transition-all duration-300"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Full Details
        </Button>
      </div>
    </div>
  );
};
