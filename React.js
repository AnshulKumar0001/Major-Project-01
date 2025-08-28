import React, { useState } from 'react';

// Main App Component
export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // If login is successful
        setMessage(Welcome, ${data.username}! Login successful.);
      } else {
        setMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center font-sans">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-400">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your username"
              required
            />
          </div>
          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
              required
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login
          </button>
        </form>
        {/* Display Login Status Message */}
        {message && (
          <p className="mt-6 text-center text-sm text-gray-400">{message}</p>
        )}
      </div>
    </div>
  );
}
