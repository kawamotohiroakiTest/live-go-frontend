import React, { useState, useEffect } from 'react';
import VideoHubComponent from '../src/components/Videohub/VideoHubComponent';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Home = () => {
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
    <div>
      <VideoHubComponent />
      <footer className="mt-auto p-4 bg-gray-200 text-center">
        {!isLoggedIn ? (
          <>
            <p className="mb-2">
              <Link href="/users/register" className="text-blue-500 hover:underline">
                登録ページへ
              </Link>
            </p>
            <p className="mb-2">
              <Link href="/users/login" className="text-blue-500 hover:underline">
                ログインページへ
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="mb-2">
              <Link href="/videoupload/upload" className="text-blue-500 hover:underline">
                動画アップロードページへ
              </Link>
            </p>
            <p className="mb-2">
              <Link href="/users/mypage" className="text-blue-500 hover:underline">
                マイページへ
              </Link>
            </p>
            <p className="mb-2">
              <span onClick={handleLogout} className="text-red-500 hover:underline cursor-pointer">
                ログアウト
              </span>
            </p>
          </>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </footer>
    </div>
  );
};

export default Home;
