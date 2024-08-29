import React, { useState } from 'react';
import HomeComponent from '../src/components/HomeComponent';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Home = () => {
  const [error, setError] = useState('');
  const router = useRouter();

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
        // If logout is successful, redirect to the home page
        router.push('/');
      } else {
        // If there is an error, show the error message
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
      <p>
        <a href="#" onClick={handleLogout}>
          Logout
        </a>
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Home;
