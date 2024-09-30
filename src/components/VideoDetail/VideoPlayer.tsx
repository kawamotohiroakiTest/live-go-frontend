import React from 'react';

interface VideoPlayerProps {
  video: any;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  return (
    <div className="relative w-full h-64 md:h-96 mb-4">
      {video.Files && video.Files.length > 0 && (
        <video controls className="w-full h-full object-contain rounded-lg">
          <source src={video.Files[0].FilePath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
