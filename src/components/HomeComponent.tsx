// src/components/HomeComponent.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const fetchTodoData = async (id: number, apiUrl: string): Promise<any> => {
  try {
    const response = await fetch(`${apiUrl}/todo/${id}`);
    if (!response.ok) {
      throw new Error('Todo not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const HomeComponent = () => {
  const [data, setData] = useState<any>(null);
  const [todoId, setTodoId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_PREFIX || '';

  useEffect(() => {
    if (todoId) {
      fetchTodoData(Number(todoId), apiUrl)
        .then((data) => {
          setData(data);
          setError(null);
        })
        .catch((error) => {
          setError('このタスクIDは存在しません');
          setData(null);
        });
    }
  }, [todoId, apiUrl]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoId(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (todoId) {
      fetchTodoData(Number(todoId), apiUrl)
        .then((data) => {
          setData(data);
          setError(null);
        })
        .catch((error) => {
          setError('このタスクIDは存在しません');
          setData(null);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <header className="text-center">
          <p className="text-gray-700 text-lg mb-4">Edit <code>pages/index.tsx</code> and save to reload.</p>
          <a
            className="text-blue-500 hover:underline"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>

          {/* Todo IDを入力するフォーム */}
          <form onSubmit={handleSubmit} className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter Todo ID:
              <input
                type="number"
                value={todoId}
                onChange={handleInputChange}
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
            <button
              type="submit"
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Fetch Todo
            </button>
          </form>

          {/* エラーメッセージを表示 */}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          {/* 取得したデータを表示 */}
          {data ? (
            <TodoItem data={data} />
          ) : (
            !error && <p className="text-gray-500 mt-4">Loading...</p>
          )}
        </header>
      </div>
    </div>
  );
};

const TodoItem = ({ data }: { data: any }) => (
  <div className="mt-6 p-4 bg-gray-50 rounded-md shadow-sm">
    <h2 className="text-xl font-semibold text-gray-800">Todo-Item:</h2>
    <p className="text-gray-600">ID: {data.id}</p>
    <p className="text-gray-600">Title: {data.title}</p>
    <p className="text-gray-600">Completed: {data.completed ? 'Yes' : 'No'}</p>
  </div>
);

export default HomeComponent;
