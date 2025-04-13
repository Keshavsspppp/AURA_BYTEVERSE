'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';

// Import images
import WarriorII from '../assets/img/Warrior II pose.png';
import TreePose from '../assets/img/Tree pose.png';
import TPose from '../assets/img/T pose.png';
import DownwardDog from '../assets/img/DownwardDog.png';
import Plank from '../assets/img/Plank.png';
import CobraPose from '../assets/img/CobraPose.png';

export default function PracticePage() {
  const location = useLocation();
  const [webcamError, setWebcamError] = useState(null);

  // Map pose names from YogaPoses.jsx to PracticePage.jsx
  const poseNameMap = {
    Trikonasana: 'Triangle Pose',
    Virabadrasana: 'Warrior II Pose',
    Vrikshasana: 'Tree Pose',
    'Downward Dog': 'Downward Dog',
    Plank: 'Plank',
    'Cobra Pose': 'Cobra Pose',
  };

  const initialPose = poseNameMap[location.state?.selectedPose] || 'Warrior II Pose';
  const [selectedPose, setSelectedPose] = useState(initialPose);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSets, setTotalSets] = useState(3);
  const [duration, setDuration] = useState(30);
  const [sets, setSets] = useState(3);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [feedback, setFeedback] = useState({
    message: `Please align with ${initialPose}.`,
    color: 'text-red-500',
  });
  const timerRef = useRef(null);

  const poseImages = {
    'Warrior II Pose': WarriorII,
    'Tree Pose': TreePose,
    'T Pose': TPose,
    'Downward Dog': DownwardDog,
    Plank: Plank,
    'Cobra Pose': CobraPose,
  };

  const fetchSessionData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/update_session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration, sets, current_set: currentSet }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        setFeedback({
          message: 'Error communicating with server.',
          color: 'text-red-500',
        });
        return;
      }
      if (data.current_pose === selectedPose) {
        setFeedback({
          message: `Great job! You're in ${selectedPose}!`,
          color: 'text-green-500',
        });
      } else if (data.current_pose) {
        setFeedback({
          message: `Detected ${data.current_pose}. Try adjusting to ${selectedPose}.`,
          color: 'text-red-500',
        });
      } else {
        setFeedback({
          message: `Please align with ${selectedPose}.`,
          color: 'text-red-500',
        });
      }
    } catch (error) {
      setFeedback({
        message: `Error communicating with server: ${error.message}. Is the backend running on port 3001?`,
        color: 'text-red-500',
      });
    }
  };

  const startTimer = () => {
    if (isTimerRunning) return;
    setIsTimerRunning(true);
    timerRef.current = setInterval(async () => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCurrentSet((prevSet) => {
            if (prevSet >= totalSets) {
              clearInterval(timerRef.current);
              setIsTimerRunning(false);
              setFeedback({
                message: 'Workout complete! Well done!',
                color: 'text-green-500',
              });
              resetTimer();
              return prevSet;
            }
            fetchSessionData();
            return prevSet + 1;
          });
          return duration;
        }
        return prev - 1;
      });
      await fetchSessionData();
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
  };

  const resetTimer = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/reset_session', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      clearInterval(timerRef.current);
      setTimeRemaining(duration);
      setCurrentSet(1);
      setIsTimerRunning(false);
      setFeedback({
        message: `Please align with ${selectedPose}.`,
        color: 'text-red-500',
      });
      await fetchSessionData();
    } catch (error) {
      setFeedback({
        message: `Error resetting session: ${error.message}`,
        color: 'text-red-500',
      });
    }
  };

  const handlePoseSelect = (pose) => {
    setSelectedPose(pose);
    setFeedback({
      message: `Please align with ${pose}.`,
      color: 'text-red-500',
    });
    resetTimer();
  };

  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value) || 30;
    setDuration(newDuration);
    setTimeRemaining(newDuration);
  };

  const handleSetsChange = (e) => {
    const newSets = parseInt(e.target.value) || 3;
    setSets(newSets);
    setTotalSets(newSets);
  };

  useEffect(() => {
    fetchSessionData();
    const interval = setInterval(fetchSessionData, 2000);
    return () => clearInterval(interval);
  }, [selectedPose, duration, sets, currentSet]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const handleImageError = () => {
    setWebcamError('Failed to load webcam feed. Ensure the backend is running on port 3001 and webcam is accessible.');
  };

  const retryWebcam = () => {
    setWebcamError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Back to Poses
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Webcam Feed</h2>
            {webcamError ? (
              <div>
                <p className="text-red-500">{webcamError}</p>
                <button
                  onClick={retryWebcam}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Retry Webcam
                </button>
              </div>
            ) : (
              <img
                src="http://127.0.0.1:3001/video_feed"
                alt="Webcam feed"
                className="w-full rounded-lg"
                onError={handleImageError}
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Pose</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(poseImages).map(([pose, image]) => (
                  <button
                    key={pose}
                    onClick={() => handlePoseSelect(pose)}
                    className={`p-3 rounded-lg transition ${
                      selectedPose === pose
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={pose}
                      className="w-full h-32 object-contain mb-2"
                    />
                    <p className="text-center font-medium text-gray-700">{pose}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Timer Controls</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-gray-700">Duration (seconds):</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={handleDurationChange}
                    className="w-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="5"
                    max="300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="font-medium text-gray-700">Sets:</label>
                  <input
                    type="number"
                    value={sets}
                    onChange={handleSetsChange}
                    className="w-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="10"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700">Time Remaining: {timeRemaining}s</p>
                    <p className="font-medium text-gray-700">
                      Set {currentSet} of {totalSets}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={startTimer}
                      disabled={isTimerRunning}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
                    >
                      Start
                    </button>
                    <button
                      onClick={pauseTimer}
                      disabled={!isTimerRunning}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition"
                    >
                      Pause
                    </button>
                    <button
                      onClick={resetTimer}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Feedback</h2>
              <p className={`text-lg ${feedback.color}`}>{feedback.message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}