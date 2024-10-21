import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = () => {
    axios.post('http://localhost:3000/api/short', { originalUrl })
      .then((res) => {
        setShortUrl(res.data);
        console.log("API response", res.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white shadow-md rounded-lg max-w-md w-full p-6'>
        <h1 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
          URL Shortener
        </h1>
        <div className='flex flex-col space-y-4'>
          <input
            type="text"
            placeholder='Enter your URL'
            onChange={(e) => setOriginalUrl(e.target.value)}
            className='border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
          />
          <button
            onClick={handleSubmit}
            className='bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 font-medium transition'>
            Shorten URL
          </button>

          {shortUrl && (
            <div className='mt-6 text-center'>
              <p className='text-gray-600 mb-2'>Shortened URL:</p>
              <a
                href={shortUrl?.shortUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 underline break-words'>
                {shortUrl?.shortUrl}
              </a>
              {shortUrl.qrCodeImg && (
                <div className='mt-4 flex justify-center'>
                  <img src={shortUrl?.qrCodeImg} alt='Generated QR Code' className='w-32 h-32' />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
