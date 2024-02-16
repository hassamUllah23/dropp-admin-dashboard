import { useEffect, useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

const languages = [
  {
    id: 1,
    title: 'English',
  },
  {
    id: 2,
    title: 'Arabic',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function RadioBox({onLanguageChange}) {
  const [languageSelect, setLanguageSelect] = useState(null);

  useEffect(() => {
      onLanguageChange(languageSelect)
  },[languageSelect])

  return (
    <RadioGroup value={languageSelect} onChange={setLanguageSelect}>
      <RadioGroup.Label className='text-base mt-4 text-white inline-block '>
        Please select the language
      </RadioGroup.Label>

      <div className='mt-4 grid grid-cols-2 gap-2'>
        {languages.map((language) => (
          <RadioGroup.Option
            key={language.id}
            value={language}
            className={({ active }) =>
              classNames(
                active
                  ? 'border-white-300 ring-2 ring-white'
                  : 'border-gray-300',
                'relative flex cursor-pointer rounded-lg border darkGrayBg text-white p-4 shadow-sm focus:outline-none'
              )
            }
          >
            {({ checked, active }) => (
              <>
                <span className='flex flex-1'>
                  <span className='flex flex-col'>
                    <RadioGroup.Label
                      as='span'
                      className='block text-sm font-medium text-white'
                    >
                      {language.title}
                    </RadioGroup.Label>
                  </span>
                </span>
                <CheckCircleIcon
                  className={classNames(
                    !checked ? 'invisible' : '',
                    'h-5 w-5 text-white-600'
                  )}
                  aria-hidden='true'
                />
                <span
                  className={classNames(
                    active ? 'border' : 'border-2',
                    checked ? 'border-white-600' : 'border-transparent',
                    'pointer-events-none absolute -inset-px rounded-lg'
                  )}
                  aria-hidden='true'
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}