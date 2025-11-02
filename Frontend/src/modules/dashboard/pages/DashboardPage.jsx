import { useState, useEffect, useRef } from 'react';
import { PlusCircle, CheckCircle, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Modal } from '../../../shared/components/Modal';
import { Loader } from '../../../shared/components/Loader';
import { DailyReflectionForm } from '../components/DailyReflectionForm';
import { AnalysisCard } from '../components/AnalysisCard';
import { reflectionAPI, analysisAPI } from '../../../api';

export const DashboardPage = () => {
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [todayReflectionExists, setTodayReflectionExists] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await loadDashboardData();
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [reflectionData, analysisData] = await Promise.all([
        reflectionAPI.checkToday(),
        analysisAPI.getLatest(),
      ]);
      
      setTodayReflectionExists(reflectionData.exists);
      setLatestAnalysis(analysisData.analysis);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReflectionSuccess = async () => {
    setShowReflectionModal(false);
    setTodayReflectionExists(true);
    setAnalysisLoading(true);
    
    // Poll for AI analysis with retries
    const pollForAnalysis = async (attempts = 0, maxAttempts = 10) => {
      try {
        const analysisData = await analysisAPI.getLatest();
        
        if (analysisData.analysis) {
          setLatestAnalysis(analysisData.analysis);
          setAnalysisLoading(false);
          return;
        }
        
        // If no analysis yet and haven't exceeded max attempts, try again
        if (attempts < maxAttempts) {
          setTimeout(() => pollForAnalysis(attempts + 1, maxAttempts), 3000);
        } else {
          // Max attempts reached, stop loading
          setAnalysisLoading(false);
        }
      } catch (error) {
        console.error('Error loading analysis:', error);
        
        // Retry on error if haven't exceeded max attempts
        if (attempts < maxAttempts) {
          setTimeout(() => pollForAnalysis(attempts + 1, maxAttempts), 3000);
        } else {
          setAnalysisLoading(false);
        }
      }
    };
    
    // Start polling after a brief delay to allow backend to start processing
    setTimeout(() => pollForAnalysis(), 2000);
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            Welcome Back! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track your daily reflections and gain insights into your personal growth journey
          </p>
        </div>

        {/* Daily Reflection Card */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Daily Practice</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">Daily Reflection</h2>
                <p className="text-indigo-50 mb-6 text-sm sm:text-base leading-relaxed">
                  {todayReflectionExists
                    ? 'Excellent work! You\'ve completed today\'s reflection. Your insights are being processed to help you grow.'
                    : 'Take a mindful moment to reflect on your day. Your thoughts and experiences matter in your journey of self-discovery.'}
                </p>
                {todayReflectionExists ? (
                  <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3 text-indigo-600 shadow-lg">
                    <CheckCircle className="w-6 h-6" />
                    <div>
                      <p className="font-semibold text-sm">Completed for Today</p>
                      <p className="text-xs text-indigo-500">Come back tomorrow</p>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowReflectionModal(true)}
                    className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Start Today's Reflection
                  </Button>
                )}
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <Sparkles className="w-32 h-32 text-white opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Current Streak</h3>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              {todayReflectionExists ? '1' : '0'}
            </p>
            <p className="text-xs text-gray-500">consecutive days</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Reflections</h3>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              {todayReflectionExists ? '1+' : '0'}
            </p>
            <p className="text-xs text-gray-500">entries recorded</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Growth Status</h3>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">Growing</p>
            <p className="text-xs text-gray-500">on your journey</p>
          </div>
        </div>

        {/* Latest Analysis */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Your Personal Insights
              </h2>
              <p className="text-sm text-gray-500">Personalized guidance based on your reflections</p>
            </div>
          </div>
          {analysisLoading ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 border border-gray-100">
              <div className="text-center">
                <div className="inline-flex p-4 bg-indigo-50 rounded-full mb-4">
                  <Loader size="lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Your Reflection</h3>
                <p className="text-gray-600 mb-1">We're processing your thoughts and generating personalized insights...</p>
                <p className="text-gray-500 text-sm">This typically takes 15-30 seconds</p>
              </div>
            </div>
          ) : (
            <AnalysisCard analysis={latestAnalysis} isLoading={false} />
          )}
        </div>
      </div>

      {/* Daily Reflection Modal */}
      <Modal
        isOpen={showReflectionModal}
        onClose={() => setShowReflectionModal(false)}
        title="Daily Reflection"
        size="lg"
      >
        <DailyReflectionForm
          onSuccess={handleReflectionSuccess}
          onCancel={() => setShowReflectionModal(false)}
        />
      </Modal>
    </div>
  );
};
