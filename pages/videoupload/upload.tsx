import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null); // サムネイルの状態を管理
  const [title, setTitle] = useState<string>(''); // タイトルの状態を管理
  const [description, setDescription] = useState<string>(''); // 説明の状態を管理
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);  // アップロード中の状態を管理
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/users/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedThumbnail = e.target.files ? e.target.files[0] : null;
    setThumbnail(selectedThumbnail);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {


    if (!file) {
      setError('動画ファイルを選択してください。');
      return;
    }

    setIsUploading(true);  // アップロード開始
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/videoupload/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ファイルのアップロードに失敗しました。');
      }

      setMessage('ファイルが正常にアップロードされました。');
      setError(null);
    } catch (error) {
      console.error('File upload error:', error);
      setError(error.message || 'ファイルのアップロードに失敗しました。');
      setMessage(null);
    } finally {
      setIsUploading(false);  // アップロード終了
    }
  };

  const handleGoToTop = () => {
    router.push('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">ファイルアップロード</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        <div className="mb-4">
          <input
            type="text"
            placeholder="タイトルを入力してください"
            value={title}
            onChange={handleTitleChange}
            className="block w-full p-2 mb-4 border rounded"
          />
          <textarea
            placeholder="説明を入力してください"
            value={description}
            onChange={handleDescriptionChange}
            className="block w-full p-2 mb-4 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">動画ファイルを選択</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isUploading}  // アップロード中は無効化
          />
        </div>

        <div>
          <button
            type="button"
            onClick={handleUpload}
            className="w-full bg-blue-500 py-2 rounded-md hover:bg-blue-600 transition duration-200 mb-4"
            disabled={isUploading}  // アップロード中は無効化
          >
            {isUploading ? 'アップロード中...' : 'アップロード'}
          </button>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoToTop}
            className="w-full bg-gray-500 py-2 rounded-md hover:bg-gray-600 transition duration-200"
          >
            TOPへ戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
