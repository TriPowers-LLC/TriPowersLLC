import { useState } from 'react';
import axios from 'axios';

export default function JobGenerator() {
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');

  const handleGenerate = async () => {
    try {
      const res = await axios.post('/api/jobdescription', { prompt: input });
      const message = res.data.choices?.[0]?.message?.content;
      setDescription(message || 'No description generated.');

      // save to your jobs store
      const job = { title: input, description };
      await axios.post('/api/jobs', job, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onNewJob(); // let parent refetch
    } catch (err) {
      console.error(err);
      setDescription('Error generating description.');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">AI Job Description Generator</h2>
      <textarea
        className="w-full border p-2 rounded-sm mb-2"
        placeholder="Enter role prompt..."
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-sm"
        onClick={handleGenerate}
      >
        Generate
      </button>

      {description && (
        <div className="mt-4 p-3 border rounded-sm bg-gray-100 whitespace-pre-wrap">
          {description}
        </div>
      )}
    </div>
  );
}
