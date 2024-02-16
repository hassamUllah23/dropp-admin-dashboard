import React, { useState } from 'react';

export default function SelectLanguage({onLanguageChange}) {

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredOptions = ['Arabic', 'English'].filter(option =>
    option.toLowerCase().includes(searchTerm)
  );
  
  const handleOptionClick = (e,option) => {
    e.preventDefault();
    setSelectedOption(option);
    onLanguageChange(option)
    setIsOpen(false); 
  };
  
  return (
    <div className="text-white justify-start flex-wrap grid grid-cols-2 text-left">
      
      <div className="relative group">
        <p className='w-full pb-4'>Please select language</p>
        <button
          id="dropdown-button"
          className="inline-flex justify-between w-full px-4 py-2 mb-2 text-sm font-medium text-white bg-darkGrayBg border border-gray-300 rounded-md shadow-sm focus:outline-none "
          onClick={toggleDropdown}
        >
          <span className="mr-2">{selectedOption ? selectedOption : 'Select Language'}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 ml-2 -mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div
          id="dropdown-menu"
          className={`absolute overflow-auto right-0 left-0 top-18 darkGrayBg z-20 mt-0 rounded-md shadow-lg border border-gray-300  p-1 space-y-1 ${isOpen ? '' : 'hidden'}`}
        >
          <input
            id="search-input"
            className="block w-full text-sm px-4 py-2 darkGrayBg text-white border rounded-md border-gray-300 focus:outline-none"
            type="text"
            placeholder="Search languages"
            autoComplete="off"
            value={searchTerm}
            onChange={handleSearchInput}
          />

          {filteredOptions.map(option => (
            <a
              key={option}
              href="#"
              className="block text-sm px-4 py-1.5 text-white hover:bg-gray-100 active:bg-black-100 cursor-pointer rounded-md"
              onClick={(e) => handleOptionClick(e, option)}
            >
              {option}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
