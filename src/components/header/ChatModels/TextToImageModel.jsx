
import React, { useState } from 'react';
import { selectChat, useDispatch, useSelector } from '@/lib';

const TextToImageModel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Aws Bedrock');

  const handleOptionClick = (value, value2) => {
    setSelectedOption(value2);
    setIsOpen(false);
    console.log(value);
  };

  return (
    <div className="w-full py-1 flex items-center justify-between flex-wrap relative">
      <p className="pt-2 py-1 text-white/80 pb-3 text-sm">Text to image</p>
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black text-left text-sm inline-block px-3 py-2 rounded-lg font-light cursor-pointer w-40 border border-gray-150"
        >
          {selectedOption}
          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className=" absolute z-30 top-2 right-2 cursor-pointer"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path></svg>
        </button>
        {isOpen && (
          <ul className="absolute bg-black w-40 border border-gray-150 py-1 mt-1 rounded-lg text-xs">
            <li onClick={() => handleOptionClick('aws_bedrock', 'Aws Bedrock')} className="cursor-pointer px-3 py-1 hover:bg-gray-100">
            Aws Bedrock
            </li>
            <li onClick={() => handleOptionClick('octoai', 'Octoai')} className="cursor-pointer px-3 py-1 hover:bg-gray-100">
            Octoai
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default TextToImageModel;


