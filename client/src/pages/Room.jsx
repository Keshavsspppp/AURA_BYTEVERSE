import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';

const Room = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // If user is not logged in, don't render the room content
  if (!user) {
    return null;
  }

  const createRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      const response = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newRoomName, createdBy: user.id }),
      });
      const data = await response.json();
      setRooms([...rooms, data]);
      setNewRoomName('');
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  // Update the joinRoom function to fetch messages when joining a room
  const joinRoom = async (roomId) => {
    setCurrentRoom(roomId);
    try {
      const response = await fetch(`http://localhost:5000/api/messages/room/${roomId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Add these new state variables at the top with other states
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  
  // Add these new functions before the return statement
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('audio/'))) {
      setSelectedFile(file);
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setSelectedFile(new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' }));
      };
      
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      audioStream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };
  
  // Update the sendMessage function
  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!currentMessage.trim() && !selectedFile) || !currentRoom) return;
  
    try {
      const formData = new FormData();
      formData.append('roomId', currentRoom);
      formData.append('userId', user._id || user.id);
      formData.append('username', user.email || user.name || 'Anonymous');
  
      if (selectedFile) {
        formData.append('file', selectedFile);
        formData.append('fileType', selectedFile.type.startsWith('image/') ? 'image' : 'audio');
      }
      if (currentMessage.trim()) {
        formData.append('content', currentMessage);
      }
  
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, data]);
      setCurrentMessage('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Update the message display section in the return statement
  <div className="flex-1 overflow-y-auto p-6 border rounded-lg bg-gray-50">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`mb-6 flex flex-col ${
          message.userId === (user._id || user.id) ? 'items-end' : 'items-start'
        }`}
      >
        <div className="text-sm text-gray-500 mb-1 px-2">
          {message.username} • {new Date(message.createdAt).toLocaleTimeString()}
        </div>
        <div
          className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
            message.userId === (user._id || user.id)
              ? 'bg-yellow-500 text-white rounded-tr-none'
              : 'bg-white rounded-tl-none'
          }`}
        >
          {message.fileType === 'image' && (
            <img 
              src={`http://localhost:5000${message.fileUrl}`} 
              alt="Shared image" 
              className="rounded-lg mb-2 max-w-full" 
            />
          )}
          {message.fileType === 'audio' && (
            <audio controls className="w-full mb-2">
              <source src={`http://localhost:5000${message.fileUrl}`} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          )}
          {message.content && <div>{message.content}</div>}
        </div>
      </div>
    ))}
  </div>
  
  {/* Update the form section */}
  <form onSubmit={sendMessage} className="flex gap-3 p-4 border-t mt-auto">
    <input
      type="text"
      value={currentMessage}
      onChange={(e) => setCurrentMessage(e.target.value)}
      placeholder="Type your message..."
      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
    />
    <input
      type="file"
      accept="image/*,audio/*"
      onChange={handleFileSelect}
      className="hidden"
      id="file-input"
    />
    <label
      htmlFor="file-input"
      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      title="Upload image"
    >
      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </label>
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      className={`p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
        isRecording ? 'bg-red-500 text-white' : 'hover:bg-gray-50'
      }`}
      title={isRecording ? "Stop recording" : "Start recording"}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
    <button
      type="submit"
      className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-semibold flex items-center gap-2"
    >
      <span>Send</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  </form>
  
  // Add this useEffect after your state declarations
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/rooms');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    if (user) {
      fetchRooms();
    }
  }, [user]);

  const deleteRoom = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setRooms(rooms.filter(room => room._id !== roomId));
        if (currentRoom === roomId) {
          setCurrentRoom(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Rooms List - Enhanced */}
        <Card className="md:col-span-1 bg-white shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Chat Rooms</h2>
          <div className="mb-6">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Enter room name..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <button
              onClick={createRoom}
              className="w-full mt-3 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-semibold"
            >
              Create Room
            </button>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {rooms.map((room) => (
              <div key={room._id} className="flex items-center gap-2 hover:transform hover:scale-[1.02] transition-transform duration-200">
                <button
                  onClick={() => joinRoom(room._id)}
                  className={`flex-1 p-3 text-left rounded-lg transition-colors duration-200 ${
                    currentRoom === room._id 
                      ? 'bg-yellow-100 text-yellow-800 font-medium' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {room.name}
                </button>
                <button
                  onClick={() => deleteRoom(room._id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Area - Enhanced */}
        <Card className="md:col-span-3 bg-white shadow-lg h-[calc(100vh-8rem)] flex flex-col">
          {currentRoom ? (
            <>
              <div className="flex-1 overflow-y-auto p-6 border rounded-lg bg-gray-50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-6 flex flex-col ${
                      message.userId === (user._id || user.id) ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="text-sm text-gray-500 mb-1 px-2">
                      {message.username} • {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                        message.userId === (user._id || user.id)
                          ? 'bg-yellow-500 text-white rounded-tr-none'
                          : 'bg-white rounded-tl-none'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="flex gap-3 p-4 border-t mt-auto">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-semibold flex items-center gap-2"
                >
                  <span>Send</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 flex-col gap-4">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-xl font-medium">Select a room to start chatting</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Room;