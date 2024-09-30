import React, { useEffect, useState } from 'react';
import VideoList from './VideoList';
import Recommendations from './Recommendations';

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
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">動画一覧</h1>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          {videos.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-700">動画がアップロードされていません。</p>
            </div>
          ) : (
            <VideoList videos={videos} handlePlay={handlePlay} />
          )}

          <div className="mt-4">
            <button
              onClick={fetchRecommendations}
              className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-full border border-yellow-600 shadow-lg hover:bg-yellow-600 hover:border-yellow-700 transition duration-300"
            >
              AIレコメンド動画
            </button>
          </div>

          {recommendations.length > 0 && (
            <Recommendations recommendations={recommendations} handlePlay={handlePlay} />
          )}
        </header>
      </div>
    </div>
  );
};

export default VideoHubComponent;
