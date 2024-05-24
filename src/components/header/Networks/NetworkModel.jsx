import React, { useEffect, useState } from 'react';
import useApiHook from '@/hooks/useApiHook';

const NetworkModel = ({ model, showLoading, resetData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const { handleApiCall } = useApiHook();

  const handleOptionClick = async (value, value2) => {
    if (value === model.solana) {
      showLoading(false);
      return;
    }

    setSelectedOption(value2);
    setIsOpen(false);
    showLoading(true);

    const values = {
      settingsId: model.id,
      solana: value,
      polygon: model.polygon,
    };

    const result = await handleApiCall({
      method: 'PUT',
      url: '/settings/change',
      data: values,
    });

    if (result?.status === 200) {
      showLoading(false);
      resetData(result?.data);
    }
  };

  useEffect(() => {
    // Set initial selected option based on model data
    setSelectedOption(
      model.solana === 'mainnet'
        ? 'Mainnet'
        : model.solana === 'devnet'
        ? 'Devnet'
        : null
    );
  }, [model]);

  return (
    <div className='w-full py-1 flex items-center justify-between flex-wrap relative'>
      <p className='pt-2 py-1 text-white/80 pb-3 text-sm'>Solana Network</p>
      <div className='relative inline-block'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='bg-black text-left text-sm inline-block px-3 py-2 rounded-lg font-light cursor-pointer w-40 border border-gray-150'
        >
          {selectedOption}
          <svg
            width='16'
            height='16'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className=' absolute z-30 top-2 right-2 cursor-pointer'
          >
            <path
              fillRule='evenodd'
              d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z'
              clipRule='evenodd'
            ></path>
          </svg>
        </button>
        {isOpen && (
          <ul className='absolute bg-black w-40 border border-gray-150 py-1 mt-1 rounded-lg text-xs'>
            <li
              onClick={() => handleOptionClick('mainnet', 'Mainnet')}
              className='cursor-pointer px-3 py-1 hover:bg-gray-100'
            >
              Mainnet
            </li>
            <li
              onClick={() => handleOptionClick('devnet', 'Devnet')}
              className='cursor-pointer px-3 py-1 hover:bg-gray-100'
            >
              Devnet
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default NetworkModel;
