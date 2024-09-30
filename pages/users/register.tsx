import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useAuth from '../../src/hooks/useAuth';
import AuthForm from './components/AuthForm';
import Footer from '../../src/components/Home/Footer';

const Register = () => {
  const { isLoggedIn, error: logoutError, handleLogout } = useAuth();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (mail: string, pass: string, name?: string) => {
    if (!name || !mail || !pass) {
      setError('全てのフィールドを入力してください。');
      return;
    }

    if (pass.length < 8) {
      setError('パスワードは8文字以上にしてください。');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';
      const response = await fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mail, pass }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '登録に失敗しました。');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      router.push('/users/complete');
    } catch (error) {
      setError(error.message || '登録に失敗しました。再試行してください。');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-grow flex items-center justify-center">
        <AuthForm handleSubmit={handleSubmit} error={error} isRegister />
      </div>
      <Footer isLoggedIn={isLoggedIn} error={logoutError || error} handleLogout={handleLogout} />
    </div>
  );
};

export default Register;
