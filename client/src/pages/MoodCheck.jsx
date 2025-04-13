<<<<<<< HEAD
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const MoodCheck = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emotion, setEmotion] = useState(null);
  const intervalRef = useRef(null); // Add this to store interval reference

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const MODEL_URL = '/models';
      
      // Wait for models to load
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      
      setIsLoading(false);
      console.log('Models loaded successfully');
    } catch (error) {
      console.error('Error loading models:', error);
      setIsLoading(false);
    }
  };

  const handleStream = async () => {
    if (webcamRef.current && webcamRef.current.video) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;

      // Wait for video metadata to load
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          resolve();
        };
      });

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight
      };

      canvas.width = displaySize.width;
      canvas.height = displaySize.height;
      faceapi.matchDimensions(canvas, displaySize);

      // Clear previous interval if exists
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(async () => {
        if (video.readyState === 4) {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          if (detections && detections.length > 0) {
            const expressions = detections[0].expressions;
            const dominantEmotion = Object.keys(expressions).reduce((a, b) => 
              expressions[a] > expressions[b] ? a : b
            );
            setEmotion(dominantEmotion);

            // Send emotion data to backend
            try {
              await axios.post('/api/reports', {
                emotion: dominantEmotion,
                confidence: expressions[dominantEmotion]
              });
            } catch (error) {
              console.error('Error saving emotion data:', error);
            }

            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
          }
        }
      }, 100);
    }
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mood Check</h1>
          <p className="mt-2 text-gray-600">Let's analyze your current emotional state</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading emotion detection models...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="relative">
              <Webcam
                ref={webcamRef}
                className="w-full rounded-lg"
                onUserMedia={handleStream}
                mirrored={true}
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: "user"
                }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                style={{ transform: 'scaleX(1)' }} // Remove mirroring from canvas
              />
            </div>

            {emotion && (
              <div className="mt-6 text-center">
                <div className={`inline-block px-4 py-2 rounded-full ${getEmotionColor(emotion)}`}>
                  <p className="text-lg font-semibold capitalize">
                    Current Mood: {emotion}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
=======
import { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { Card } from '../components/ui/Card';

const MoodCheck = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [emotions, setEmotions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      if (!videoRef.current) {
        console.error('Video element not found');
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsCameraOn(false);
    setEmotions(null);
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleVideoPlay = () => {
    const canvas = canvasRef.current;
    const displaySize = { width: 600, height: 450 }; // Set fixed dimensions
    faceapi.matchDimensions(canvas, displaySize);

    intervalRef.current = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        try {
          const detections = await faceapi
            .detectSingleFace(
              videoRef.current, 
              new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
            )
            .withFaceExpressions();

          if (detections) {
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
            setEmotions(detections.expressions);
          }
        } catch (error) {
          console.error('Error in face detection:', error);
        }
      }
    }, 200); // Increased interval for better performance
  };

  // Update video element props
  <video
    ref={videoRef}
    width="600"
    height="450"
    autoPlay
    playsInline
    muted
    onPlay={handleVideoPlay}
    className={`rounded-lg ${!isCameraOn ? 'hidden' : ''}`}
  />
  const getTopEmotion = () => {
    if (!emotions) return null;
    return Object.entries(emotions).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  };

  const getMoodSuggestion = (emotion) => {
    const suggestions = {
      happy: "Your positive mood is great! Consider sharing your joy with others.",
      sad: "Take some time for self-care. Maybe listen to uplifting music or talk to a friend?",
      angry: "Try some deep breathing exercises or take a short walk to calm down.",
      neutral: "You seem balanced. Good time for productive activities!",
      surprised: "Something caught you off guard? Take a moment to process it.",
      fearful: "Remember you're safe. Practice grounding exercises if needed.",
      disgusted: "Step away from what's bothering you and focus on pleasant things."
    };
    return suggestions[emotion] || "Take a moment to check in with yourself.";
  };

  const getDetailedAnalysis = (emotion) => {
    const recommendations = {
      happy: {
        title: "Maintaining Your Positive Energy",
        activities: [
          "Share your joy with friends or family through a call",
          "Start a creative project you've been thinking about",
          "Write down what made you happy today in a gratitude journal",
          "Use this energy to tackle challenging tasks",
          "Consider exercising to maintain endorphin levels"
        ],
        resources: ["Meditation apps", "Gratitude journaling", "Social connection"]
      },
      sad: {
        title: "Lifting Your Spirits",
        activities: [
          "Take a warm shower or bath",
          "Listen to uplifting music or podcasts",
          "Go for a walk in nature",
          "Reach out to a trusted friend or family member",
          "Practice gentle yoga or stretching"
        ],
        resources: ["Therapy resources", "Mood-tracking apps", "Support groups"]
      },
      angry: {
        title: "Finding Your Balance",
        activities: [
          "Practice deep breathing exercises (4-7-8 technique)",
          "Do physical exercise to release tension",
          "Write down your thoughts in a journal",
          "Take a break from the situation",
          "Try progressive muscle relaxation"
        ],
        resources: ["Anger management techniques", "Stress relief apps", "Counseling"]
      },
      neutral: {
        title: "Maintaining Balance",
        activities: [
          "Set goals for the day",
          "Try something new and engaging",
          "Connect with friends or colleagues",
          "Learn a new skill",
          "Organize your space"
        ],
        resources: ["Productivity apps", "Learning platforms", "Mindfulness"]
      },
      surprised: {
        title: "Processing the Unexpected",
        activities: [
          "Take deep breaths to center yourself",
          "Write down what surprised you",
          "Talk through the situation with someone",
          "Practice mindfulness meditation",
          "Give yourself time to process"
        ],
        resources: ["Mindfulness apps", "Journaling tools", "Relaxation techniques"]
      },
      fearful: {
        title: "Finding Security and Calm",
        activities: [
          "Practice grounding exercises (5-4-3-2-1 technique)",
          "Call a trusted friend or family member",
          "Create a safe, cozy environment",
          "Try guided meditation",
          "Use positive affirmations"
        ],
        resources: ["Anxiety management tools", "Crisis helplines", "Therapy resources"]
      },
      disgusted: {
        title: "Shifting Your Focus",
        activities: [
          "Change your environment temporarily",
          "Focus on pleasant sensory experiences",
          "Practice mindful breathing",
          "Engage in a favorite hobby",
          "Listen to soothing music"
        ],
        resources: ["Mindfulness apps", "Pleasant activity scheduling", "Support networks"]
      }
    };

    return recommendations[emotion] || {
      title: "General Wellness",
      activities: [
        "Take a few deep breaths",
        "Check in with yourself",
        "Stay hydrated",
        "Take a short walk",
        "Practice mindfulness"
      ],
      resources: ["Wellness apps", "Self-care guides", "Mental health resources"]
    };
  };

  // Update the Card component that shows the analysis
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mood Check</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="relative">
            <video
              ref={videoRef}
              width="600"
              height="450"
              autoPlay
              muted
              onPlay={handleVideoPlay}
              className={`rounded-lg ${!isCameraOn ? 'hidden' : ''}`}
            />
            <canvas
              ref={canvasRef}
              width="600"
              height="450"
              className={`absolute top-0 left-0 ${!isCameraOn ? 'hidden' : ''}`}
            />
            
            {!isCameraOn ? (
              <div className="flex flex-col items-center justify-center h-[450px] bg-gray-100 rounded-lg">
                <button
                  onClick={startCamera}
                  className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Start Camera'}
                </button>
              </div>
            ) : (
              <button
                onClick={stopCamera}
                className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Stop Camera
              </button>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Your Mood Analysis</h2>
          {emotions && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-3">Current Mood</h3>
                <div className="text-3xl font-bold text-yellow-500 mb-2">
                  {getTopEmotion()?.charAt(0).toUpperCase() + getTopEmotion()?.slice(1)}
                </div>
                
                {/* Add detailed analysis section */}
                {getTopEmotion() && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-xl font-medium text-gray-800">
                      {getDetailedAnalysis(getTopEmotion()).title}
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-lg font-medium text-gray-700 mb-2">Recommended Activities:</h5>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                          {getDetailedAnalysis(getTopEmotion()).activities.map((activity, index) => (
                            <li key={index}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-lg font-medium text-gray-700 mb-2">Helpful Resources:</h5>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                          {getDetailedAnalysis(getTopEmotion()).resources.map((resource, index) => (
                            <li key={index}>{resource}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-medium mb-3">Emotion Breakdown</h3>
                {Object.entries(emotions).map(([emotion, value]) => (
                  <div key={emotion} className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 capitalize">{emotion}</span>
                      <span className="text-gray-500">{(value * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
>>>>>>> dcc88fc (Initial commit)
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default MoodCheck;


const getEmotionColor = (emotion) => {
  const colorMap = {
    happy: 'bg-yellow-100 text-yellow-800',
    sad: 'bg-blue-100 text-blue-800',
    angry: 'bg-red-100 text-red-800',
    fearful: 'bg-purple-100 text-purple-800',
    disgusted: 'bg-green-100 text-green-800',
    surprised: 'bg-pink-100 text-pink-800',
    neutral: 'bg-gray-100 text-gray-800'
  };
  return colorMap[emotion] || 'bg-gray-100 text-gray-800';
};
=======
export default MoodCheck;
>>>>>>> dcc88fc (Initial commit)
