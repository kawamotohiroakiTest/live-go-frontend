import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../src/components/Header';
import Search from '../../src/components/SearchComponent';



type VideoFile = {
  ID: number;
  FilePath: string;
};

type Video = {
  ID: number;
  Title: string;
  Description: string;
  Files: VideoFile[];
};

const SearchPage: React.FC = () => {
  const router = useRouter();
  const { query } = router.query;
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    const handleSearch = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';
        const response = await fetch(`${apiUrl}/videohub/search?query=${encodeURIComponent(query as string)}`);

        if (!response.ok) {
          throw new Error('検索に失敗しました');
        }

        const data = await response.json();
        setSearchResults(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('未知のエラーが発生しました');
        }
        setSearchResults([]);
      }
    };

    handleSearch();
  }, [query]);

  return (
    <>
        <Header />
        <Search />
        <div className="min-h-screen bg-white flex justify-center">
            <div className="container mx-auto p-8">
                <div className="w-full p-4">
                {searchResults.length > 0 ? (
                    <>
                    <div className="border-b-2 pb-4 mb-4">
                        <h1 className="text-xl font-bold">
                        {searchResults.length} 件の動画が見つかりました
                        </h1>
                    </div>

                    {/* 検索結果の表示 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {searchResults.map((video, index) => (
                        <div key={index} className="relative block bg-gray-100 shadow hover:bg-gray-200 p-2 text-center">
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
                        ))}
                    </div>
                    </>
                ) : (
                    <p className="text-gray-500 col-span-full">検索結果が見つかりませんでした。</p>
                )}

                {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
            </div>
        </div>
    </>
    )
}

export default SearchPage;
