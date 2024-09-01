import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Complete = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // トークンがない場合はトップページへリダイレクト
    if (!token) {
      router.push('/');
    }
  }, [router]);

  const handleGoToTop = () => {
    router.push('/');
  };

  const handleGoToMyPage = () => {
    router.push('/users/mypage');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">登録完了</h1>
        <p className="mb-4 text-center">ご登録が完了しました。</p>
        <div>
          <button
            onClick={handleGoToTop}
            className="w-full bg-blue-500 py-2 rounded-md hover:bg-blue-600 transition duration-200 z-20 relative"
          >
            TOPへ戻る
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={handleGoToMyPage}
            className="w-full bg-gray-500 py-2 rounded-md hover:bg-gray-600 transition duration-200 z-20 relative"
          >
            マイページへ進む
          </button>
        </div>
      </div>
    </div>
  );
};

export default Complete;
