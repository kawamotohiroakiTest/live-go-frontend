import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import VideoPlayer from './VideoPlayer';
import CommentsSection from './CommentsSection';

const ShowVideo = () => {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';
  const apiUrlVideoHub = process.env.NEXT_PUBLIC_API_URL_PREFIX_VIDEOHUB || '';
  const websocket = process.env.NEXT_PUBLIC_API_URL_PREFIX_WEBSOCKET || '';
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!id) return;

    const socket = new WebSocket(`${websocket}/ws?video_id=${id}`);
    setWs(socket);

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      console.log('WebSocket message received:', messageData);

      if (messageData.type === 'new_comment') {
        const newComment = {
          content: messageData.comment.Content,
          id: messageData.comment.ID,
          user_id: messageData.comment.UserID,
          video_id: messageData.comment.VideoID,
        };
        setComments((prevComments) => [...prevComments, newComment]);
      }
    };

    return () => {
      socket.close();
    };
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGoToTop = () => {
    router.push('/');
  };

  useEffect(() => {
    if (id) {
      const fetchVideo = async () => {
        try {
          const response = await fetch(`${apiUrlVideoHub}/videos/${id}`);
          if (!response.ok) {
            throw new Error('動画の取得に失敗しました');
          }
          const data = await response.json();
          setVideo(data);
          setComments(data.comments);
        } catch (error) {
          setError('動画の取得に失敗しました');
        }
      };
      fetchVideo();
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
  }, [router]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment) return;

    const videoIdNumber = parseInt(id as string, 10);
    const payload = { video_id: videoIdNumber, content: newComment };

    try {
      if (!token) {
        console.error('No token found, user is not authenticated');
        return;
      }

      const response = await fetch(`${apiUrl}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('コメントの送信に失敗しました');
      }

      const newCommentData = await response.json();
      setNewComment('');

      if (ws) {
        ws.send(JSON.stringify({ type: 'new_comment', comment: newCommentData }));
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!video) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {!isMobile && (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
          <div style={{ width: '80%' }} className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg">
            <div style={{ width: '75%' }} className="p-4">
              <VideoPlayer video={video} />
              <div>
                <div className="py-2 border-b border-gray-300">
                  <h1 className="text-2xl font-semibold">{video.Title}</h1>
                  <div className="text-gray-600 text-sm mt-2">
                    <span>{new Date(video.PostedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">説明PC</h2>
                  <p className="text-gray-700 mt-2">{video.Description}</p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGoToTop}
                  className="w-full bg-gray-500 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                >
                  TOPへ戻る
                </button>
              </div>
            </div>
            <CommentsSection
              comments={comments}
              token={token}
              newComment={newComment}
              setNewComment={setNewComment}
              handleCommentSubmit={handleCommentSubmit}
            />
          </div>
        </div>
      )}

      {isMobile && (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
          <div style={{ width: '95%' }} className="bg-white shadow-lg rounded-lg">
            <div className="p-4">
              <VideoPlayer video={video} />
              <div>
                <div className="py-2 border-b border-gray-300">
                  <h1 className="text-2xl font-semibold">{video.Title}</h1>
                  <div className="text-gray-600 text-sm mt-2">
                    <span>{new Date(video.PostedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">説明SP</h2>
                  <p className="text-gray-700 mt-2">{video.Description}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleGoToTop}
                    className="w-full bg-gray-500 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                  >
                    TOPへ戻る
                  </button>
                </div>
              </div>
            </div>
            <CommentsSection
              comments={comments}
              token={token}
              newComment={newComment}
              setNewComment={setNewComment}
              handleCommentSubmit={handleCommentSubmit}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ShowVideo;
