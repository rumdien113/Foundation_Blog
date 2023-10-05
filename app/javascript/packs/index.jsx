import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App'; // Đường dẫn đến tệp chứa component App

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('app'));
});
