import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

type VideoFile = {
  ID: number;
  FilePath: string;
  ThumbnailPath?: string;
};

type Video = {
  ID: number;
  Title: string;
  Description: string;
  Files: VideoFile[];
};


const VideoSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();


  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 検索クエリ付きで検索結果ページに遷移
      router.push(`/videos/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="w-full flex items-center border border-gray-300 rounded-lg p-2">
        <input
          type="text"
          className="flex-grow ml-4 px-4 py-2 border rounded-lg"
          placeholder="動画を検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 1110-10 7.5 7.5 0 01-10 10z" />
          </svg>
        </button>
      </div>

      {/* 検索結果の表示 */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
        {searchResults.length > 0 ? searchResults.map((video, index) => (
          <div key={index} className="relative block bg-gray-100 shadow hover:bg-gray-200">
            {video.Files && video.Files[0] && (
              <video
                controls
                className="w-full h-40 object-cover"
              >
                <source src={video.Files[0].FilePath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <h2 className="mt-2 text-lg font-semibold text-gray-800">
              <Link href={`/videos/${video.ID}`}>
                {video.Title}
              </Link>
            </h2>
            <p className="text-gray-600 mt-1 mb-4">{video.Description}</p>
          </div>
        )) : hasSearched && (
          <p className="text-gray-500 col-span-full">検索結果が見つかりませんでした。</p>
        )}
      </div>
    </div>
  );
};

export default VideoSearch;
