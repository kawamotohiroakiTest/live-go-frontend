import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const MyPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';
      const token = localStorage.getItem('token');
      if (!token) {
        // トークンがない場合はログインページにリダイレクト
        router.push('/users/login');
        return;
      }
  
      console.log('JWT Token:', token);
  
      try {
          const response = await fetch(`${apiUrl}/users/mypage`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, 
              },
          });
  
          console.log('Response Status:', response.status); 
          console.log('Response Headers:', response.headers); 
  
          if (!response.ok) {
              const errorData = await response.json();
              console.log('Error Response Data:', errorData);
              throw new Error(errorData.error || 'Failed to fetch user data.');
          }
  
          const data = await response.json();
          console.log('User Data:', data);
          setUser(data);
      } catch (error) {
          console.error('Error fetching user data:', error);
          setError(error.message || 'Failed to fetch user data.');
      } finally {
          setLoading(false);
      }
  };
  
    fetchUserData();
  }, [router]);

  const handleGoToTop = () => {
    router.push('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">My Page</h1>
        {user ? (
          <div>
            <p><strong>Name:</strong> {user.Name}</p>
            <p><strong>Email:</strong> {user.Mail}</p>
          </div>
        ) : (
          <p>User data not available</p>
        )}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoToTop}
            className="w-full bg-gray-500 py-2 rounded-md hover:bg-gray-600 transition duration-200 z-20 relative"
          >
            TOPへ戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
