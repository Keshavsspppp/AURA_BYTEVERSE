import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import EmotionalSummary from '../components/EmotionalSummary';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Report = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/reports');
      const reportsData = Array.isArray(response.data) ? response.data : [];
      setReports(reportsData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reports');
      setLoading(false);
    }
  };

  const prepareChartData = (report) => {
    const emotions = report.expressions.map(exp => exp.emotion);
    const timestamps = report.expressions.map(exp => 
      new Date(exp.timestamp).toLocaleTimeString()
    );

    return {
      labels: timestamps,
      datasets: [
        {
          label: 'Emotion Timeline',
          data: emotions.map((emotion, index) => ({
            x: timestamps[index],
            y: emotion,
            confidence: report.expressions[index].confidence
          })),
          borderColor: 'rgb(255, 191, 0)',
          tension: 0.1
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Emotion Reports</h1>
          <p className="mt-2 text-gray-600">Track your emotional journey over time</p>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No reports available yet. Complete a mood check to see your results!</p>
          </div>
        ) : (
          <>
            <EmotionalSummary reports={reports} />
            <div className="space-y-8">
              {reports.map((report) => (
                <div key={report._id} className="bg-white rounded-lg shadow p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Report from {new Date(report.createdAt).toLocaleDateString()}
                    </h2>
                    <p className="text-gray-600">
                      Dominant Emotion: <span className="font-medium capitalize">{report.summary.dominantEmotion}</span>
                    </p>
                  </div>

                  <div className="h-64">
                    <Line
                      data={prepareChartData(report)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            type: 'category',
                            labels: ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral']
                          }
                        },
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const dataPoint = context.raw;
                                return `Emotion: ${dataPoint.y} (Confidence: ${Math.round(dataPoint.confidence * 100)}%)`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
                    {Object.entries(report.summary.emotionFrequency).map(([emotion, count]) => (
                      <div key={emotion} className="text-center p-2 rounded-lg bg-gray-50">
                        <p className="font-medium capitalize">{emotion}</p>
                        <p className="text-gray-600">{count} times</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Report;