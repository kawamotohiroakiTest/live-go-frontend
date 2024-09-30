import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from './components/AuthForm';
import useAuth from '../../src/hooks/useAuth';
import Footer from '../../src/components/Home/Footer';

const Login = () => {
  const { isLoggedIn, error: logoutError, handleLogout } = useAuth();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (mail: string, pass: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';
      const response = await fetch(`${apiUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail, pass }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ログインに失敗しました。');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      router.push('/');
    } catch (error) {
      setError(error.message || 'ログインに失敗しました。再試行してください。');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-grow flex items-center justify-center">
        <AuthForm handleSubmit={handleSubmit} error={error} />
      </div>
      <Footer isLoggedIn={isLoggedIn} error={logoutError || error} handleLogout={handleLogout} />
    </div>
  );
};

export default Login;
