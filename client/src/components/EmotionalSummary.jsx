import React from 'react';

const getEmotionalInsights = (reports) => {
  if (!reports || reports.length === 0) return null;

  // Analyze emotional patterns across all reports
  const allEmotions = reports.flatMap(report => 
    report.expressions.map(exp => exp.emotion)
  );

  // Calculate overall emotional distribution
  const emotionalDistribution = allEmotions.reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {});

  // Determine dominant emotions
  const totalEmotions = allEmotions.length;
  const emotionalPercentages = Object.entries(emotionalDistribution)
    .map(([emotion, count]) => ({
      emotion,
      percentage: (count / totalEmotions) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return emotionalPercentages;
};

const getRecommendations = (emotionalInsights) => {
  if (!emotionalInsights || emotionalInsights.length === 0) return [];

  const recommendations = [];
  const dominantEmotion = emotionalInsights[0].emotion;

  // Personalized recommendations based on dominant emotion
  switch (dominantEmotion) {
    case 'happy':
      recommendations.push(
        {
          title: 'Maintain Positive Energy',
          activities: [
            'Practice gratitude journaling',
            'Share your joy with others',
            'Engage in creative activities'
          ]
        }
      );
      break;
    case 'sad':
      recommendations.push(
        {
          title: 'Uplift Your Mood',
          activities: [
            'Try a guided meditation session',
            'Take a mindful walk outside',
            'Connect with a supportive friend'
          ]
        }
      );
      break;
    case 'angry':
      recommendations.push(
        {
          title: 'Find Inner Peace',
          activities: [
            'Practice deep breathing exercises',
            'Try progressive muscle relaxation',
            'Write down your thoughts'
          ]
        }
      );
      break;
    case 'fearful':
      recommendations.push(
        {
          title: 'Build Confidence',
          activities: [
            'Practice grounding techniques',
            'Try positive affirmations',
            'Start with small achievable goals'
          ]
        }
      );
      break;
    case 'neutral':
      recommendations.push(
        {
          title: 'Enhance Emotional Awareness',
          activities: [
            'Try mindfulness exercises',
            'Start emotion journaling',
            'Explore new activities'
          ]
        }
      );
      break;
    default:
      recommendations.push(
        {
          title: 'General Wellbeing',
          activities: [
            'Practice regular meditation',
            'Maintain a consistent sleep schedule',
            'Engage in physical activity'
          ]
        }
      );
  }

  return recommendations;
};

const EmotionalSummary = ({ reports }) => {
  const emotionalInsights = getEmotionalInsights(reports);
  const recommendations = getRecommendations(emotionalInsights);

  if (!emotionalInsights) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Emotional Summary & Recommendations
      </h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Your Emotional Pattern
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {emotionalInsights.map(({ emotion, percentage }) => (
            <div key={emotion} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="font-medium capitalize">{emotion}</p>
              <p className="text-gray-600">{percentage.toFixed(1)}%</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Personalized Recommendations
        </h3>
        {recommendations.map((rec, index) => (
          <div key={index} className="mb-4">
            <h4 className="font-medium text-yellow-600 mb-2">{rec.title}</h4>
            <ul className="space-y-2">
              {rec.activities.map((activity, actIndex) => (
                <li key={actIndex} className="flex items-center text-gray-600">
                  <span className="mr-2">•</span>
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionalSummary;