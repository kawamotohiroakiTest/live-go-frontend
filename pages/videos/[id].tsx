import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const ShowVideo = () => {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]); // Placeholder for comments

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';

  useEffect(() => {
    if (id) {
      const fetchVideo = async () => {
        try {
          const response = await fetch(`${apiUrl}/videos/${id}`);
          if (!response.ok) {
            throw new Error('動画の取得に失敗しました');
          }
          const data = await response.json();
          console.log(data);
          setVideo(data);
        } catch (error) {
          setError('動画の取得に失敗しました');
        }
      };
      fetchVideo();
    }
  }, [id]);

  // Placeholder to simulate fetching comments
  useEffect(() => {
    if (id) {
      // Simulated fetching of comments
      setComments([
        { id: 1, username: 'User1', comment: 'Great video!' },
        { id: 2, username: 'User2', comment: 'Thanks for sharing!' },
      ]);
    }
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!video) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex justify-center">
      <div className="bg-white shadow-lg">
        {/* Video Player */}
        <div className="relative w-full h-64 md:h-96 mb-4">
          {video.Files && video.Files.length > 0 && (
            <video controls className="w-full h-full max-w-full max-h-96 object-contain">
              <source src={video.Files[0].FilePath} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <div className="ml-5">
          {/* Video Title and Metadata */}
          <div className="py-2 border-b border-gray-300">
            <h1 className="text-2xl font-semibold">{video.Title}</h1>
            <div className="text-gray-600 text-sm mt-2">
              <span>{video.ViewCount} 回視聴 • </span>
              <span>{new Date(video.PostedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold">説明</h2>
            <p className="text-gray-700 mt-2">{video.Description}</p>
          </div>
        </div>

      </div>
      {/* Comments Section */}
      <div className="bg-white">
          <h2 className="text-lg font-semibold">コメント</h2>
          <div className="mt-4 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-gray-100 rounded-lg">
                  <p className="font-semibold">{comment.username}</p>
                  <p className="text-gray-600">{comment.comment}</p>
                </div>
              ))
            ) : (
              <p>コメントがありません。</p>
            )}
          </div>
        </div>
    </div>
  );
};

export default ShowVideo;
