import React, { useState, useEffect, useCallback } from 'react';

const meditationTypes = [
  { id: 'breathing', name: 'Breathing Meditation', description: 'Focus on your breath to find inner peace' },
  { id: 'body-scan', name: 'Body Scan', description: 'Progressive relaxation from head to toe' },
  { id: 'mindfulness', name: 'Mindfulness', description: 'Present moment awareness practice' },
];

const Meditation = () => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(300); // 5 minutes in seconds
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [customTime, setCustomTime] = useState(5); // Default 5 minutes
  const [selectedType, setSelectedType] = useState('breathing');
  const [showGuide, setShowGuide] = useState(true);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeChange = (event) => {
    const newTime = parseInt(event.target.value);
    setCustomTime(newTime);
    setTime(newTime * 60);
  };

  const updateBreathPhase = useCallback(() => {
    setBreathPhase((prev) => {
      if (prev === 'inhale') return 'hold';
      if (prev === 'hold') return 'exhale';
      return 'inhale';
    });
  }, []);

  useEffect(() => {
    let interval = null;
    let breathInterval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);

      breathInterval = setInterval(updateBreathPhase, 4000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => {
      clearInterval(interval);
      clearInterval(breathInterval);
    };
  }, [isActive, time, updateBreathPhase]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(customTime * 60);
    setBreathPhase('inhale');
  };

  const getBreathAnimation = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'scale-125 transition-all duration-4000 ease-in-out';
      case 'hold':
        return 'scale-125 transition-all duration-4000 ease-in-out';
      case 'exhale':
        return 'scale-100 transition-all duration-4000 ease-in-out';
      default:
        return '';
    };
  };

  const getBreathText = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return '';
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Meditation & Mindfulness</h1>
          <p className="text-xl text-gray-600">Find peace in the present moment</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {meditationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-6 rounded-xl transition-all duration-300 ${selectedType === type.id
                ? 'bg-white shadow-lg transform -translate-y-1'
                : 'bg-white/50 hover:bg-white hover:shadow-md'}`}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.name}</h3>
              <p className="text-gray-600">{type.description}</p>
            </button>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Breathing Circle */}
            <div className="relative w-56 h-56">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full shadow-inner ${getBreathAnimation()}`}
              >
                <div className="absolute inset-0 bg-white/30 rounded-full filter blur-md"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-2xl font-medium text-gray-800 animate-pulse">{getBreathText()}</p>
              </div>
            </div>

            {/* Timer Display */}
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {formatTime(time)}
            </div>

            {/* Timer Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <select
                value={customTime}
                onChange={handleTimeChange}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                disabled={isActive}
              >
                <option value="1">1 minute</option>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="30">30 minutes</option>
              </select>

              <button
                onClick={toggleTimer}
                className={`px-8 py-2 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 ${isActive
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'}`}
              >
                {isActive ? 'Pause' : 'Start'}
              </button>

              <button
                onClick={resetTimer}
                className="px-8 py-2 rounded-lg text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Guide Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between text-left mb-4"
          >
            <h3 className="text-xl font-semibold text-gray-900">Meditation Guide</h3>
            <span className="text-gray-500">{showGuide ? '−' : '+'}</span>
          </button>
          
          {showGuide && (
            <div className="space-y-4 text-gray-600 animate-fadeIn">
              <p className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">1</span>
                <span>Find a quiet, comfortable space where you won't be disturbed</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">2</span>
                <span>Sit or lie down in a comfortable position</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">3</span>
                <span>Follow the breathing circle's rhythm</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">4</span>
                <span>Inhale deeply through your nose as the circle expands</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">5</span>
                <span>Hold your breath briefly when indicated</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">6</span>
                <span>Exhale slowly through your mouth as the circle contracts</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Meditation;