'use client';
import { model } from '@/firebase'; // Import the model we just exported
import { useState } from 'react';

export default function TestAIPage() {
  const [response, setResponse] = useState('');

  const runTest = async () => {
    try {
      const result = await model.generateContent("Hello! Are you connected to AI Home?");
      setResponse(result.response.text());
    } catch (error) {
      setResponse("Error: " + error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>AI Home Connection Test</h1>
      <button onClick={runTest}>Run Test</button>
      <p>Response: {response}</p>
    </div>
  );
}