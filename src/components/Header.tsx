import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';
    try {
      const response = await fetch(`${apiUrl}/users/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        setIsLoggedIn(false);
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.message || 'Logout failed. Please try again.');
      }
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed. Please try again.');
    }
  };

  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* 左側のアイコン */}
        <Link href="/" className="text-white hover:underline">
            <div className="flex items-center space-x-4">
                <div className="text-white text-lg">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.121 19.364A9 9 0 1119.364 5.121 9 9 0 015.12 19.364z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
                    </svg>
                </div>
                <div>
                    <p className="text-gray-300">動画</p>
                </div>
            </div>
        </Link>

        {/* 右側のメニュー項目 */}
        <div className="flex space-x-6 items-center">
          {!isLoggedIn ? (
            <>
              <Link href="/users/register" className="text-white hover:underline">
                登録ページへ
              </Link>
              <Link href="/users/login" className="text-white hover:underline">
                ログインページへ
              </Link>
            </>
          ) : (
            <>
              <Link href="/videoupload/upload" className="text-white hover:underline">
                動画アップロードページへ
              </Link>
              <Link href="/users/mypage" className="text-white hover:underline">
                マイページへ
              </Link>
              <span onClick={handleLogout} className="text-red-500 hover:underline cursor-pointer">
                ログアウト
              </span>
            </>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </header>
  );
};

export default Header;
