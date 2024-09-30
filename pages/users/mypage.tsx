import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserProfile from './components/UserProfile';
import useAuth from '../../src/hooks/useAuth';
import Footer from '../../src/components/Home/Footer';

const MyPage = () => {
  const { isLoggedIn, error: logoutError, handleLogout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/users/login');
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/users/mypage`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user data.');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message || 'Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-grow">
        {user ? <UserProfile user={user} /> : <p>User data not available</p>}
      </div>
      <Footer isLoggedIn={isLoggedIn} error={logoutError || error || ''} handleLogout={handleLogout} />
    </div>
  );
};

export default MyPage;
