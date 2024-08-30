import React, { useState, useEffect } from 'react';
import HomeComponent from '../src/components/HomeComponent';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Home = () => {
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // トークンがあればログイン状態とみなす
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
        localStorage.removeItem('token'); // JWTトークンを削除
        setIsLoggedIn(false); // ログアウト後はログイン状態を解除
        router.push('/'); // トップページにリダイレクト
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
      <HomeComponent />
      {!isLoggedIn ? (
        <>
          <p>
            <Link href="/users/register">
              Go to Register Page
            </Link>
          </p>
          <p>
            <Link href="/users/login">
              Go to Login Page
            </Link>
          </p>
        </>
      ) : (
        <>
          <p>
            <Link href="/videoupload/upload">
              Go to Image Upload Page
            </Link>
          </p>
          <p>
            <Link href="/users/mypage">
              Go to My Page
            </Link>
          </p>
          <p>
            <a href="#" onClick={handleLogout}>
              Logout
            </a>
          </p>
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Home;
