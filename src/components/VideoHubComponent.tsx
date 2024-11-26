import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const fetchVideos = async (apiUrl: string): Promise<any[]> => {
  try {
    const response = await fetch(`${apiUrl}/videos/list`);
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

const VideoHubComponent = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';

  useEffect(() => {
    fetchVideos(apiUrl)
      .then((videos) => {
        console.log("Fetched videos:", videos);
        setVideos(videos);
        setError(null);
      })
      .catch((error) => {
        setError('動画の取得に失敗しました');
        setVideos([]);
      });
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">動画一覧</h1>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          {videos.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-700">動画がアップロードされていません。</p>
              <Link href="/videoupload/upload">
                <span className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer">
                  動画をアップロードする
                </span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videos.map((video, index) => (
                <div key={index} className="block bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">{video.Title}</h2>
                  <p className="text-gray-600">{video.Description}</p>
                  {video.Files && video.Files[0] && (
                    <video controls className="mt-2 w-full rounded-lg">
                      <source src={video.Files[0].FilePath} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ))}
            </div>
          )}
        </header>
      </div>
    </div>
  );
};

export default VideoHubComponent;
