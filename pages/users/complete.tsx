import React from 'react';
import { useRouter } from 'next/router';

const Complete = () => {
  const router = useRouter();

  const handleGoToTop = () => {
    router.push('/');
  };

  const handleGoToMyPage = () => {
    router.push('/users/mypage');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">登録が完了しました！</h1>
        <p className="text-gray-700 mb-6">ご登録ありがとうございます。次のステップに進んでください。</p>
        <div className="space-y-4">
          <button
            onClick={handleGoToTop}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            TOPへ戻る
          </button>
          <button
            onClick={handleGoToMyPage}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
          >
            マイページへ進む
          </button>
        </div>
      </div>
    </div>
  );
};

export default Complete;
