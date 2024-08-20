import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL_PREFIX;

    if (!apiUrl) {
      console.error('API URL is not defined');
      return;
    }
    const getTodoApi = apiUrl+ '/todo/3';
    console.log('API URL:', getTodoApi);

    // GoバックエンドのAPIエンドポイントにリクエストを送信
    fetch(getTodoApi)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

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

        {/* 取得したデータを表示 */}
        {data ? (
          <div>
            <h1>Todo-Item:</h1>
            <p>ID: {data.id}</p>
            <p>Title: {data.title}</p>
            <p>Completed: {data.completed ? 'Yes' : 'No'}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
}

export default App;
