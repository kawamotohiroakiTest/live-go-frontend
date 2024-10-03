import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const fetchVideos = async (apiUrlVideoHub: string): Promise<any[]> => {
  try {
    const response = await fetch(`${apiUrlVideoHub}/videos/list`);
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    const data = await response.json();
    return data.slice(0, 10);
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

const VideoHubComponent = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';
  const apiUrlVideoHub = process.env.NEXT_PUBLIC_API_URL_PREFIX_VIDEOHUB || '';
  const apiUrlAI = process.env.NEXT_PUBLIC_API_URL_PREFIX_AI || '';

  useEffect(() => {
    // ローカルストレージからuser_idを取得
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError('ユーザーがログインしていません');
    }

    fetchVideos(apiUrlVideoHub)
      .then((videos) => {
        setVideos(videos);
        setError(null);
      })
      .catch((error) => {
        setError('動画の取得に失敗しました');
        setVideos([]);
      });
  }, [apiUrl]);

  // 動画が再生された時に呼ばれる関数
  const handlePlay = async (videoId: string) => {
    if (!userId) {
      console.log('ユーザーIDがありません');
      return;
    }

    const payload = {
      user_id: Number(userId),
      video_id: videoId,
      event_type: 'play',
      event_value: null,
    };

    try {
      const response = await fetch(`${apiUrl}/videos/create_user_video_interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Video play interaction saved successfully');
      } else {
        console.error('Failed to save interaction');
      }
    } catch (err) {
      console.error('Error saving play interaction:', err);
    }
  };

  const fetchRecommendations = async () => {
    const storedUserId = localStorage.getItem('user_id');

    try {
      // おすすめ動画のIDリストを取得
      const response = await fetch(`${apiUrlAI}/videos/recommendations/user_${storedUserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        const videoIds = data.map((item: { itemId: string }) => item.itemId);

        const videoResponse = await fetch(`${apiUrl}/videos/get_videos_by_ids`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoIds }),
        });

        if (videoResponse.ok) {
          const videoData = await videoResponse.json();
          console.log(videoData);
          setRecommendations(videoData);
        } else {
          const videoErrorData = await videoResponse.json();
          setError(videoErrorData.message || 'Failed to fetch videos. Please try again.');
        }
      } else {
        setError(data.message || 'Failed to fetch recommendations. Please try again.');
      }
    } catch (err) {
      console.error('Fetch recommendations error:', err);
      setError('Failed to fetch recommendations. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="container mx-auto p-8">
        <header className="text-center mb-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video, index) => (
                <div key={index} className="relative block bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200">
                  {video.Files && video.Files[0] && (
                    <video
                      controls
                      className="mt-2 w-full h-40 object-cover rounded-lg"
                      onPlay={() => handlePlay(video.ID)}
                    >
                      <source src={video.Files[0].FilePath} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <h2 className="mt-2 text-lg font-semibold text-gray-800">
                    <Link href={`/videos/${video.ID}`}>
                      {video.Title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mt-1">{video.Description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={fetchRecommendations}
              className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-full border border-yellow-600 shadow-lg hover:bg-yellow-600 hover:border-yellow-700 transition duration-300"
            >
              AIレコメンド動画
            </button>
          </div>

          {/* おすすめ動画の表示 */}
          {recommendations.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-700 mb-4">AIレコメンド動画</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendations.map((video, index) => (
                  <div key={index} className="relative block bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200">
                    <h2 className="mt-2 text-lg font-semibold text-gray-800">
                      <Link href={`/videos/${video.ID}`}>
                        {video.Title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mt-1">{video.Description}</p>
                    {video.Files && video.Files[0] && (
                      <video
                        controls
                        className="mt-2 w-full h-40 object-cover rounded-lg"
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
          )}
        </header>
      </div>
    </div>
  );
};

export default VideoHubComponent;
