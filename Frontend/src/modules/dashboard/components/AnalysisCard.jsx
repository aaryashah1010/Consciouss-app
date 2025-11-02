import { Lightbulb, Target, Heart, TrendingUp } from 'lucide-react';

const formatText = (text) => {
  if (!text) return null;
  
  // Split by double newlines for paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  
  return paragraphs.map((paragraph, index) => {
    // Check if it's a bullet point list
    if (paragraph.includes('\n-') || paragraph.includes('\n•')) {
      const lines = paragraph.split('\n').filter(l => l.trim());
      const title = lines[0].match(/^[^-•]+/) ? lines[0] : null;
      const items = lines.filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'));
      
      return (
        <div key={index} className="mb-4">
          {title && <p className="font-medium text-gray-900 mb-2">{title}</p>}
          <ul className="space-y-2 ml-4">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1.5">•</span>
                <span className="flex-1 text-gray-700 leading-relaxed">
                  {item.replace(/^[-•]\s*/, '')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
    // Check if it's a numbered list
    if (paragraph.match(/\n\d+\./)) {
      const lines = paragraph.split('\n').filter(l => l.trim());
      const title = lines[0].match(/^\d+\./) ? null : lines[0];
      const items = lines.filter(l => l.trim().match(/^\d+\./));
      
      return (
        <div key={index} className="mb-4">
          {title && <p className="font-medium text-gray-900 mb-2">{title}</p>}
          <ol className="space-y-2 ml-4">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-semibold text-indigo-600 min-w-[24px]">
                  {i + 1}.
                </span>
                <span className="flex-1 text-gray-700 leading-relaxed">
                  {item.replace(/^\d+\.\s*/, '')}
                </span>
              </li>
            ))}
          </ol>
        </div>
      );
    }
    
    // Regular paragraph
    return (
      <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
        {paragraph}
      </p>
    );
  });
};

export const AnalysisCard = ({ analysis, isLoading }) => {
  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 border border-gray-100">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
            <Lightbulb className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isLoading ? 'Processing Your Insights' : 'No Insights Yet'}
          </h3>
          <p className="text-gray-600 text-sm">
            {isLoading 
              ? 'We\'re analyzing your reflection to provide personalized guidance. This may take a few moments...'
              : 'Complete your daily reflection to receive personalized insights and guidance tailored to your journey.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Section */}
      {analysis.analysisText && (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Key Insights</h3>
                <p className="text-xs text-indigo-100">Understanding your reflection</p>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="prose prose-sm max-w-none">
              {formatText(analysis.analysisText)}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {analysis.recommendations && (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Action Steps</h3>
                <p className="text-xs text-blue-100">Practical guidance for growth</p>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="prose prose-sm max-w-none">
              {formatText(analysis.recommendations)}
            </div>
          </div>
        </div>
      )}

      {/* Motivational Message Section */}
      {analysis.motivationalMessage && (
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-purple-100">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Words of Encouragement</h3>
                <div className="prose prose-sm max-w-none">
                  {formatText(analysis.motivationalMessage)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
