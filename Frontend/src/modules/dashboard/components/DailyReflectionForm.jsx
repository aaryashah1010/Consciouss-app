import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { reflectionAPI } from '../../../api';

export const DailyReflectionForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    daySummary: '',
    socialMediaTime: '',
    truthfulnessKindness: '',
    consciousActions: '',
    overthinkingStress: '',
    gratitudeExpression: '',
    proudMoment: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const questions = [
    {
      key: 'daySummary',
      label: 'How was your day?',
      placeholder: 'Describe briefly or in one word...',
      rows: 2,
    },
    {
      key: 'socialMediaTime',
      label: 'How much time did you spend on social media, and how did it make you feel?',
      placeholder: 'Be honest about your usage and feelings...',
      rows: 3,
    },
    {
      key: 'truthfulnessKindness',
      label: 'Were you truthful and kind or lied and used harsh words?',
      placeholder: 'Describe in detail about the event and reaction...',
      rows: 3,
    },
    {
      key: 'consciousActions',
      label: 'Did you act consciously or react impulsively today?',
      placeholder: 'Describe the event and reaction...',
      rows: 3,
    },
    {
      key: 'overthinkingStress',
      label: 'Did you overthink or stress about something? If yes, what was it?',
      placeholder: 'Share what was on your mind...',
      rows: 3,
    },
    {
      key: 'gratitudeExpression',
      label: 'Did you express gratitude for what you have or to someone who made your day?',
      placeholder: 'Who or what are you grateful for today?...',
      rows: 3,
    },
    {
      key: 'proudMoment',
      label: 'What is one thing you are proud of doing today?',
      placeholder: 'Celebrate your achievement, big or small...',
      rows: 3,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await reflectionAPI.create(formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit reflection. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-900 px-4 sm:px-5 py-4 rounded-xl">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            Take a mindful moment to reflect on your day. Be honest with yourself - this is your personal space for growth and self-discovery.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {questions.map((question, index) => (
          <div key={question.key} className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <span className="inline-flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full text-xs font-bold">
                  {index + 1}
                </span>
                <span>{question.label}</span>
                <span className="text-red-500">*</span>
              </span>
            </label>
            <textarea
              required
              value={formData[question.key]}
              onChange={(e) => setFormData({ ...formData, [question.key]: e.target.value })}
              rows={question.rows}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none bg-white text-sm sm:text-base transition-all duration-200"
              placeholder={question.placeholder}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sticky bottom-0 bg-white pb-2 -mb-2">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel} 
          fullWidth
          className="order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          fullWidth 
          disabled={submitting}
          className="order-1 sm:order-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Submit Reflection
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};
