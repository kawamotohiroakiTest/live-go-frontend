import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';
        const response = await fetch(`${apiUrl}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mail, pass }),
        });

        console.log("Response Object:", response); // レスポンス全体を確認

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Error Response Data:", errorData);
            throw new Error(errorData.error || 'ログインに失敗しました。');
        }

        const data = await response.json();
        console.log("Received JWT Token:", data.token);
        console.log("Received User ID:", data.user_id);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user_id);

        router.push('/');  // ログイン後にリダイレクト
    } catch (error) {
        console.error("Error during login:", error);
        setError(error.message || 'ログインに失敗しました。再試行してください。');
    }
};

const handleGoToTop = () => {
  router.push('/');
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="relative p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">ログイン</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">メールアドレス</label>
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">パスワード</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 py-2 rounded-md hover:bg-blue-600 transition duration-200 z-20 relative"
          >
            ログイン
          </button>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoToTop}
            className="w-full bg-gray-500 py-2 rounded-md hover:bg-gray-600 transition duration-200 z-20 relative"
          >
            TOPへ戻る
          </button>
        </div>

      </form>
    </div>
  );
};

export default Login;
