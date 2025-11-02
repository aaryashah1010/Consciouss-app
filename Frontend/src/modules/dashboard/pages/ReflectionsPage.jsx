import { useState, useEffect } from 'react';
import { BookOpen, X } from 'lucide-react';
import { Loader } from '../../../shared/components/Loader';
import { Modal } from '../../../shared/components/Modal';
import { ReflectionCard } from '../components/ReflectionCard';
import { AnalysisCard } from '../components/AnalysisCard';
import { reflectionAPI, analysisAPI } from '../../../api';

export const ReflectionsPage = () => {
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await loadReflections(isMounted);
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const loadReflections = async (isMounted = true) => {
    setLoading(true);
    try {
      const data = await reflectionAPI.getAll({ limit: 30 });
      if (isMounted) {
        setReflections(data.reflections);
      }
    } catch (error) {
      console.error('Error loading reflections:', error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const handleViewDetails = async (reflection) => {
    setSelectedReflection(reflection);
    setShowDetailModal(true);
    setAnalysisLoading(true);
    
    try {
      const data = await analysisAPI.getByReflectionId(reflection.id);
      setSelectedAnalysis(data.analysis);
    } catch (error) {
      console.error('Error loading analysis:', error);
      setSelectedAnalysis(null);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">My Reflections</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Review your past reflections and track your personal growth journey
          </p>
        </div>

        {/* Reflections Grid */}
        {reflections.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 lg:p-16 border border-gray-100 text-center">
            <div className="inline-flex p-4 bg-indigo-50 rounded-full mb-4">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-300" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              No Reflections Yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              Start your journey of self-discovery by completing your first daily reflection
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {reflections.map((reflection) => (
              <ReflectionCard
                key={reflection.id}
                reflection={reflection}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedReflection(null);
          setSelectedAnalysis(null);
        }}
        title={selectedReflection ? formatDate(selectedReflection.reflectionDate) : 'Reflection Details'}
        size="xl"
      >
        {selectedReflection && (
          <div className="space-y-6 sm:space-y-8">
            {/* Reflection Details */}
            <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl p-6 sm:p-8 space-y-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Your Reflection</h3>
              </div>
              
              <div className="space-y-5">
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs">1</span>
                    How was your day?
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{selectedReflection.daySummary}</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs">2</span>
                    Social Media Usage
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{selectedReflection.socialMediaTime}</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">3</span>
                    Truthfulness & Kindness
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{selectedReflection.truthfulnessKindness}</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">4</span>
                    Conscious Actions
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{selectedReflection.consciousActions}</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xs">5</span>
                    Overthinking/Stress
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{selectedReflection.overthinkingStress}</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-xs">6</span>
                    Gratitude Expression
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{selectedReflection.gratitudeExpression}</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xs">7</span>
                    Proud Moment
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{selectedReflection.proudMoment}</p>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <X className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Personal Insights</h3>
              </div>
              {analysisLoading ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 border border-gray-100">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-indigo-50 rounded-full mb-4">
                      <Loader size="lg" />
                    </div>
                    <p className="text-gray-600 font-medium">Loading insights...</p>
                  </div>
                </div>
              ) : (
                <AnalysisCard analysis={selectedAnalysis} />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
