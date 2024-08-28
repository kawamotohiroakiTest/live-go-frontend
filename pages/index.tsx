// pages/index.tsx
import React from 'react';
import HomeComponent from '../src/components/HomeComponent';
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <HomeComponent />
      {/* 会員登録ページへのリンク */}
      <p>
        <Link href="/users/register">
          Go to Register Page
        </Link>
      </p>
    </div>
  );
};

export default Home;
