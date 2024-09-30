import React, { useState } from 'react';

interface AuthFormProps {
  handleSubmit: (mail: string, pass: string, name?: string) => void;
  error: string;
  isRegister?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ handleSubmit, error, isRegister = false }) => {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      handleSubmit(mail, pass, name);
    } else {
      handleSubmit(mail, pass);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={onSubmit} className="relative p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">{isRegister ? '会員登録' : 'ログイン'}</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {isRegister && (
            <div className="mb-4">
            <label className="block text-gray-700 mb-2">名前</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
        )}

        <div className="mb-4">
            <label className="block text-gray-700 mb-2">メールアドレス</label>
            <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div className="mb-6">
            <label className="block text-gray-700 mb-2">パスワード</label>
            <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div>
            <button
            type="submit"
            className="w-full bg-blue-500 py-2 rounded-md hover:bg-blue-600 transition duration-200 z-20 relative"
            >
            {isRegister ? '登録する' : 'ログイン'}
            </button>
        </div>
        </form>
    </div>
  );
};

export default AuthForm;
