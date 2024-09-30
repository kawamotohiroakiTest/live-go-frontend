import React from 'react';

interface UserProfileProps {
  user: {
    Name: string;
    Mail: string;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div>
            <p><strong>ユーザー名:</strong> {user.Name}</p>
            <p><strong>メールアドレス:</strong> {user.Mail}</p>
        </div>
    </div>
  );
};

export default UserProfile;
