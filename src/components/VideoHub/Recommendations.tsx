import React from 'react';
import Link from 'next/link';

interface RecommendationsProps {
  recommendations: any[];
  handlePlay: (videoId: string) => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations, handlePlay }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-700 mb-4">AIレコメンド動画</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recommendations.map((video, index) => (
          <div key={index} className="block bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              <Link href={`/videos/${video.ID}`}>
                {video.Title}
              </Link>
            </h2>
            <p className="text-gray-600">{video.Description}</p>
            {video.Files && video.Files[0] && (
              <video
                controls
                className="mt-2 w-full rounded-lg"
                onPlay={() => handlePlay(video.ID)}
              >
                <source src={video.Files[0].FilePath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
