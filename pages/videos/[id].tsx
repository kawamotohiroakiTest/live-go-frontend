import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const ShowVideo = () => {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]); // Comments state
  const [newComment, setNewComment] = useState(''); // New comment input
  const [token, setToken] = useState<string | null>(null); // トークンの状態管理
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';

  // Fetch video details
  useEffect(() => {
    if (id) {
      const fetchVideo = async () => {
        try {
          const response = await fetch(`${apiUrl}/videos/${id}`);
          if (!response.ok) {
            throw new Error('動画の取得に失敗しました');
          }
          const data = await response.json();
          setVideo(data);
        } catch (error) {
          setError('動画の取得に失敗しました');
        }
      };
      fetchVideo();
    }
  }, [id]);

// Fetch comments for the video
useEffect(() => {
  if (id) {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token'); // トークンを取得

        if (!token) {
          console.error('No token found, user is not authenticated');
          return;
        }

        const response = await fetch(`${apiUrl}/videos/${id}/comments`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // トークンを送信
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


  // JWTトークンを取得してセットする
  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token); // トークンを状態として保存
    console.log('Stored JWT token:', token); // トークンをコンソールに表示して確認
    if (!token) {
      router.push('/users/login'); // トークンがない場合はログインページにリダイレクト
    }
  }, [router]);
  

  // Handle new comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment) return;

    const videoIdNumber = parseInt(id as string, 10);

    if (isNaN(videoIdNumber)) {
      console.error('Invalid video ID');
      return;
    }

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
          'Authorization': `Bearer ${token}`, // JWTトークンをヘッダーに追加
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('コメントの送信に失敗しました');
      }

      const newCommentData = await response.json();
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment(''); // Clear the input field after successful submission
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  // Handle comment deletion
  const handleCommentDelete = async (commentId: number) => {
    try {
      if (!token) {
        console.error('No token found, user is not authenticated');
        return;
      }

      const response = await fetch(`${apiUrl}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // JWTトークンをヘッダーに追加
        },
      });

      if (!response.ok) {
        throw new Error('コメントの削除に失敗しました');
      }

      // Remove the comment from the state
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
      <div className="bg-white p-4 w-full max-w-2xl">
        <h2 className="text-lg font-semibold">コメント</h2>

        {/* Comment Form */}
        {token ? ( // トークンが存在する場合のみコメントフォームを表示
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

        {/* Display Comments */}
        <div className="mt-4 space-y-4">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={comment.id || index} className="p-4 bg-gray-100 rounded-lg flex justify-between">
                <div>
                  <p className="font-semibold">{comment.username || '匿名ユーザー'}</p>
                  <p className="text-gray-600">{comment.Content}</p>
                </div>
                {token && ( // トークンが存在する場合のみ削除ボタンを表示
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
  );
};

export default ShowVideo;
