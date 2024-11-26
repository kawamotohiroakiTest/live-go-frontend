import React, { useEffect, useState } from 'react';

import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState<any>(null);
  const [todoId, setTodoId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchTodoData = (id: number) => {
    const apiUrl = process.env.REACT_APP_API_URL_PREFIX;

    if (!apiUrl) {
      console.error('API URL is not defined');
      return;
    }
    const getTodoApi = `${apiUrl}/todo/${id}`;
    console.log('API URL:', getTodoApi);

    fetch(getTodoApi)
      .then(response => {
        console.log('Response:', response);
        if (!response.ok) {
          throw new Error('Todo not found');
        }
        return response.json();
      })
      .then(data => {
        console.log('Data:', data);
        setData(data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('このタスクIDは存在しません');
        setData(null);
      });
  };

  useEffect(() => {
    if (todoId) {
      fetchTodoData(Number(todoId));
    }
  }, [todoId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoId(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (todoId) {
      fetchTodoData(Number(todoId));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
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
          <div>
            <h1>Todo-Item:</h1>
            <p>ID: {data.id}</p>
            <p>Title: {data.title}</p>
            <p>Completed: {data.completed ? 'Yes' : 'No'}</p>
          </div>
        ) : (
          !error && <p>Loading...</p>
        )}
      </header>
    </div>
  );
}

export default App;
