import { useState, useEffect } from 'react';
import Sentiment from 'sentiment';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const Journal = () => {
  const [entry, setEntry] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [journals, setJournals] = useState([]);
  const sentiment = new Sentiment();
  const { user } = useAuth();

  // Add these two functions
  const getSentimentMood = (score) => {
    if (score >= 5) return 'Very Positive';
    if (score >= 2) return 'Positive';
    if (score > -2) return 'Neutral';
    if (score > -5) return 'Negative';
    return 'Very Negative';
  };

  const getRecommendations = (score) => {
    if (score >= 5) {
      return {
        title: "Maintain Your Positive Energy",
        activities: [
          "Share your happiness with others",
          "Start a new project or hobby",
          "Practice gratitude journaling",
          "Set new goals while motivated"
        ]
      };
    } else if (score >= 2) {
      return {
        title: "Build on Your Positivity",
        activities: [
          "Engage in creative activities",
          "Connect with friends",
          "Exercise or do yoga",
          "Plan something exciting"
        ]
      };
    } else if (score > -2) {
      return {
        title: "Finding Balance",
        activities: [
          "Practice mindfulness meditation",
          "Take a nature walk",
          "Write down your thoughts",
          "Try a new activity"
        ]
      };
    } else if (score > -5) {
      return {
        title: "Self-Care and Support",
        activities: [
          "Talk to a trusted friend",
          "Practice deep breathing",
          "Listen to calming music",
          "Take a relaxing bath"
        ]
      };
    } else {
      return {
        title: "Seeking Support and Comfort",
        activities: [
          "Reach out to a counselor",
          "Practice self-compassion",
          "Do gentle exercise",
          "Focus on basic self-care"
        ]
      };
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [user]);

  // Update the fetchJournals function
  const fetchJournals = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/journals', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch journals');
      const data = await response.json();
      setJournals(data);
    } catch (error) {
      console.error('Error fetching journals:', error);
    }
  };

  // Update the analyzeEntry function
  const analyzeEntry = async () => {
    if (!entry.trim() || !user) return;

    const result = sentiment.analyze(entry);
    const score = result.score;
    
    const analysisResult = {
      score: score,
      mood: getSentimentMood(score),
      recommendations: getRecommendations(score)
    };
    
    setAnalysis(analysisResult);

    try {
      const response = await fetch('http://localhost:5000/api/journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          content: entry,
          sentiment: analysisResult
        })
      });

      if (!response.ok) throw new Error('Failed to save journal');
      
      const savedJournal = await response.json();
      setJournals(prev => [savedJournal, ...prev]);
      setEntry('');
    } catch (error) {
      console.error('Error saving journal:', error);
    }
  };

  // Update the return JSX with improved UI
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Your Mindful Journal
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Write Thoughts Section - Left Side */}
        <div className="space-y-8">
          <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Write Your Thoughts</h2>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="How are you feeling today? Write your thoughts here..."
              className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none bg-gray-50 hover:bg-white transition-colors duration-200"
            />
            <button
              onClick={analyzeEntry}
              disabled={!entry.trim() || !user}
              className="w-full mt-6 bg-yellow-500 text-white py-4 rounded-lg hover:bg-yellow-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {user ? 'Save & Analyze Entry' : 'Please login to save entries'}
            </button>
          </Card>

          {/* Analysis Section - Right Side */}
          <div className="space-y-8">
            {analysis && (
              <Card className="p-8 shadow-lg bg-gradient-to-br from-yellow-50 to-white">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Analysis & Insights</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-medium mb-3 text-gray-700">Overall Mood</h3>
                    <div className="text-4xl font-bold text-yellow-500">{analysis.mood}</div>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-4 text-gray-700">{analysis.recommendations.title}</h3>
                    <ul className="space-y-3">
                      {analysis.recommendations.activities.map((activity, index) => (
                        <li key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                          <span className="text-yellow-500 text-xl">•</span>
                          <span className="text-gray-700">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Journal History Section - Full Width Below */}
      <div className="mt-8">
        <Card className="p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Journal History</h2>
          {journals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {journals.map((journal) => (
                <div key={journal._id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-500 text-sm">
                      {new Date(journal.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      journal.sentiment.mood.includes('Positive') ? 'bg-green-100 text-green-800' :
                      journal.sentiment.mood.includes('Negative') ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {journal.sentiment.mood}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-3 whitespace-pre-wrap">{journal.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No journal entries yet.</p>
              <p className="text-gray-400 text-sm">Start writing to see your entries here!</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Journal;