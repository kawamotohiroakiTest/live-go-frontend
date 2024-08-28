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
    <div className="App">
      <header className="App-header">
        <p>Edit <code>pages/index.tsx</code> and save to reload.</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        {/* Todo IDを入力するフォーム */}
        <form onSubmit={handleSubmit}>
          <label>
            Enter Todo ID:
            <input
              type="number"
              value={todoId}
              onChange={handleInputChange}
              min="1"
            />
          </label>
        </form>

        {/* エラーメッセージを表示 */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* 取得したデータを表示 */}
        {data ? (
          <TodoItem data={data} />
        ) : (
          !error && <p>Loading...</p>
        )}

      </header>
    </div>
  );
};

const TodoItem = ({ data }: { data: any }) => (
  <div>
    <h1>Todo-Item:</h1>
    <p>ID: {data.id}</p>
    <p>Title: {data.title}</p>
    <p>Completed: {data.completed ? 'Yes' : 'No'}</p>
  </div>
);

export default HomeComponent;
