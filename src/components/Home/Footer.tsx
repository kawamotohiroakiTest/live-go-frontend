import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface FooterProps {
  isLoggedIn: boolean;
  error: string;
  handleLogout: () => Promise<void>;
}

const Footer: React.FC<FooterProps> = ({ isLoggedIn, error, handleLogout }) => {
  const router = useRouter();

  return (
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
  );
};

export default Footer;
