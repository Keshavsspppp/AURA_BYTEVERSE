import { Link } from 'react-router-dom';

// Import images
import Trikonasana from '../assets/img/Trikonasana.jpg';
import Virabadrasana from '../assets/img/Virabadrasana.png';
import Vrikshasana from '../assets/img/Vrikshasana.png';
import DownwardDog from '../assets/img/DownwardDog.png';
import Plank from '../assets/img/Plank.png';
import CobraPose from '../assets/img/CobraPose.png';

export default function YogaPoses() {
  const poses = [
    {
      name: 'Trikonasana',
      image: Trikonasana,
      description: 'Reduces excess body weight, strengthens legs and arms, and improves digestion.',
    },
    {
      name: 'Virabadrasana',
      image: Virabadrasana,
      description: 'Strengthens legs, improves balance, and enhances focus.',
    },
    {
      name: 'Vrikshasana',
      image: Vrikshasana,
      description: 'Improves balance and strengthens back and legs.',
    },
    {
      name: 'Downward Dog',
      image: DownwardDog,
      description: 'Stretches the hamstrings, calves, and back, and strengthens arms.',
    },
    {
      name: 'Plank',
      image: Plank,
      description: 'Strengthens core, arms, and shoulders, and improves posture.',
    },
    {
      name: 'Cobra Pose',
      image: CobraPose,
      description: 'Strengthens the spine, opens the chest, and improves flexibility.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Explore Yoga Poses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover various yoga poses to enhance your physical and mental well-being through guided practice and real-time feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {poses.map((pose) => (
            <div
              key={pose.name}
              className="group h-[400px] [perspective:1000px]"
            >
              <div className="relative h-full w-full rounded-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front of the card */}
                <div className="absolute inset-0">
                  <div className="h-full w-full rounded-xl bg-white shadow-xl">
                    <img
                      src={pose.image}
                      alt={pose.name}
                      className="w-full h-[300px] object-contain p-4 rounded-t-xl"
                    />
                    <div className="p-4">
                      <h2 className="text-2xl font-semibold text-gray-800">{pose.name}</h2>
                    </div>
                  </div>
                </div>

                {/* Back of the card */}
                <div className="absolute inset-0 h-full w-full rounded-xl bg-yellow-500 px-8 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div className="flex min-h-full flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold text-white mb-4">{pose.name}</h3>
                    <p className="text-lg text-white mb-8">{pose.description}</p>
                    <Link
                      to="/practice"
                      state={{ selectedPose: pose.name }} // Pass selected pose
                      className="mt-2 rounded-md bg-white px-6 py-3 text-yellow-500 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Practice Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/practice"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105"
          >
            Start Your Practice Session
          </Link>
          <p className="mt-4 text-gray-600">
            Get real-time feedback and guidance for proper pose alignment
          </p>
        </div>
      </div>
    </div>
  );
}