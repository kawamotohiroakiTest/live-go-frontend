import React, { useState } from 'react';

interface CommentsSectionProps {
  comments: any[];
  token: string | null;
  newComment: string;
  setNewComment: (comment: string) => void;
  handleCommentSubmit: (e: React.FormEvent) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  token,
  newComment,
  setNewComment,
  handleCommentSubmit,
}) => {
  return (
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
                <p className="font-semibold">ユーザーID: {comment.user_id || '匿名ユーザー'}</p>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p>コメントがありません。</p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
