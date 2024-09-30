import React, { useState, useEffect } from 'react';
import VideoHubComponent from '../src/components/Videohub/VideoHubComponent';
import Footer from '../src/components/Home/Footer';
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
      <Footer isLoggedIn={isLoggedIn} error={error} handleLogout={handleLogout} />
    </div>
  );
};

export default Home;
