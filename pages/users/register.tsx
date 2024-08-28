import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Register = () => {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!name || !mail || !pass) {
      console.log('Validation error');
      setError('全てのフィールドを入力してください。');
      return;
    }

    try {
      // API呼び出し
      const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';
      const response = await fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, mail, pass }),
      });
      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '登録に失敗しました。');
      }

      // 成功時の処理
      router.push('/users/complete');
    } catch (error) {
      console.error(error);
      // エラー時の処理
      setError(error.message || '登録に失敗しました。再試行してください。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="relative p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">会員登録</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
            登録する
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
