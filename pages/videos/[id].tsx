import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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

  // WebSocket接続の初期化
  useEffect(() => {
    if (!id) return;

    const socket = new WebSocket(`${websocket}/ws?video_id=${id}`); // WebSocketサーバーのアドレスとパラメータ
    setWs(socket);

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
      console.log('WebSocket connection closed');
  };

    socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      if (messageData.type === 'new_comment') {
        setComments((prevComments) => [...prevComments, messageData.comment]);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
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
          console.log(data);
          setVideo(data);
        } catch (error) {
          setError('動画の取得に失敗しました');
        }
      };
      fetchVideo();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const fetchComments = async () => {
        try {
          const response = await fetch(`${apiUrl}/videos/${id}/comments`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('コメントの取得に失敗しました');
          }

          const data = await response.json();
          setComments(data);
        } catch (error) {
          setError('コメントの取得に失敗しました');
        }
      };
      fetchComments();
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

    const payload = {
      video_id: videoIdNumber,
      content: newComment,
    };

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

      // 新しいコメントをWebSocket経由で他のユーザーに送信
      if (ws) {
        ws.send(JSON.stringify({ type: 'new_comment', comment: newCommentData }));
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      if (!token) {
        console.error('No token found, user is not authenticated');
        return;
      }

      const response = await fetch(`${apiUrl}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('コメントの削除に失敗しました');
      }

      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
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
      {/* PCレイアウト */}
      {!isMobile && (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
          <div style={{ width: '80%' }} className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg">
            {/* Video Player */}
            <div style={{ width: '75%' }} className="p-4">
              <div className="relative w-full h-64 md:h-96 mb-4">
                {video.Files && video.Files.length > 0 && (
                  <video controls className="w-full h-full object-contain rounded-lg">
                    <source src={video.Files[0].FilePath} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

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

            {/* Comments Section */}
            <div style={{ width: '25%' }} className="p-4 bg-gray-100">
              <h2 className="text-lg font-semibold">コメント</h2>

              {token ? (
                <form onSubmit={handleCommentSubmit} className="mt-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="コメントを入力..."
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-600"
                  >
                    コメントを送信
                  </button>
                </form>
              ) : (
                <p>コメントを投稿するにはログインが必要です。</p>
              )}

              <div className="mt-4 space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={comment.id || index} className="p-4 bg-white rounded-lg flex justify-between">
                      <div>
                        <p className="font-semibold">{comment.username || '匿名ユーザー'}</p>
                        <p className="text-gray-600">{comment.Content}</p>
                      </div>
                      {token && comment.id && (
                        <button
                          onClick={() => handleCommentDelete(comment.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>コメントがありません。</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* スマホ用レイアウト */}
      {isMobile && (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
          <div style={{ width: '95%' }} className="bg-white shadow-lg rounded-lg">
            {/* Video Player */}
            <div className="p-4">
              <div className="relative w-full h-64 mb-4">
                {video.Files && video.Files.length > 0 && (
                  <video controls className="w-full h-full object-contain rounded-lg">
                    <source src={video.Files[0].FilePath} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

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

            {/* Comments Section */}
            <div className="p-4 bg-gray-100">
              <h2 className="text-lg font-semibold">コメント</h2>

              {token ? (
                <form onSubmit={handleCommentSubmit} className="mt-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="コメントを入力..."
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-600"
                  >
                    コメントを送信
                  </button>
                </form>
              ) : (
                <p>コメントを投稿するにはログインが必要です。</p>
              )}

              <div className="mt-4 space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={comment.id || index} className="p-4 bg-white rounded-lg flex justify-between">
                      <div>
                        <p className="font-semibold">{comment.username || '匿名ユーザー'}</p>
                        <p className="text-gray-600">{comment.Content}</p>
                      </div>
                      {token && comment.id && (
                        <button
                          onClick={() => handleCommentDelete(comment.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>コメントがありません。</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowVideo;
