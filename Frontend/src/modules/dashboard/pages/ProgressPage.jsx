import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Award } from 'lucide-react';
import { Loader } from '../../../shared/components/Loader';
import { reflectionAPI, analysisAPI } from '../../../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ProgressPage = () => {
  const [reflections, setReflections] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await loadProgressData(isMounted);
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const loadProgressData = async (isMounted = true) => {
    setLoading(true);
    try {
      const [reflectionData, analysisData] = await Promise.all([
        reflectionAPI.getAll({ limit: 30 }),
        analysisAPI.getAll({ limit: 30 }),
      ]);
      
      if (isMounted) {
        setReflections(reflectionData.reflections);
        setAnalyses(analysisData.analyses);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const chartData = reflections.slice(0, 7).reverse().map((reflection, index) => ({
    date: new Date(reflection.reflectionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    reflections: index + 1,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Progress Tracking</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Visualize your journey and celebrate your growth milestones
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-10 h-10 opacity-90" />
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">Total</div>
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-2">Total Reflections</h3>
              <p className="text-4xl sm:text-5xl font-bold mb-1">{reflections.length}</p>
              <p className="text-xs opacity-75">entries recorded</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-10 h-10 opacity-90" />
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">Insights</div>
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-2">AI Insights Received</h3>
              <p className="text-4xl sm:text-5xl font-bold mb-1">{analyses.length}</p>
              <p className="text-xs opacity-75">personalized analyses</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 text-white relative overflow-hidden group sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-10 h-10 opacity-90" />
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">Active</div>
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-2">Days Active</h3>
              <p className="text-4xl sm:text-5xl font-bold mb-1">{reflections.length}</p>
              <p className="text-xs opacity-75">days of practice</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        {reflections.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 border border-gray-100 mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Reflection Activity</h2>
                <p className="text-xs sm:text-sm text-gray-500">Your consistency over time</p>
              </div>
            </div>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <div className="min-w-[500px] sm:min-w-0">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="reflections" 
                      stroke="#6366F1" 
                      strokeWidth={3}
                      dot={{ fill: '#6366F1', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Recent Insights */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Insights</h2>
              <p className="text-xs sm:text-sm text-gray-500">Your latest reflections and guidance</p>
            </div>
          </div>
          {analyses.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                <Award className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Insights Yet</h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">Complete your daily reflections to receive personalized guidance and track your progress.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.slice(0, 5).map((analysis, index) => (
                <div 
                  key={analysis.id} 
                  className="group bg-gradient-to-r from-gray-50 to-indigo-50/30 hover:from-indigo-50 hover:to-purple-50 rounded-xl p-4 sm:p-5 border-l-4 border-indigo-500 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(analysis.reflectionDate).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 line-clamp-2 mb-2 text-sm sm:text-base leading-relaxed">{analysis.daySummary}</p>
                  {analysis.motivationalMessage && (
                    <div className="flex items-start gap-2 mt-3 pt-3 border-t border-gray-200">
                      <Award className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-purple-600 italic line-clamp-2 flex-1">
                        {analysis.motivationalMessage}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
