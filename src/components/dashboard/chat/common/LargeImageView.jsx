import { useState, useEffect } from 'react';

export default function LargeImageView({ onClose, imageSrc, images }) {
  const [currentIndex, setCurrentIndex] = useState(images.indexOf(imageSrc));
  const totalImages = images.length;

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % totalImages;
    setCurrentIndex(nextIndex);
  };

  const handlePrevious = () => {
    const previousIndex = (currentIndex - 1 + totalImages) % totalImages;
    setCurrentIndex(previousIndex);
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    setCurrentIndex(images.indexOf(imageSrc));
  }, [imageSrc, images]);

  return (
    <div className='fixed right-0 left-0 top-0 bottom-0 bg-black/90 z-[60]'>
      <span
        className='absolute top-8 right-10 z-20 cursor-pointer'
        onClick={handleClose}
      >
        <img src='/assets/images/sidebar/close.svg' className='w-10 h-10' />
      </span>
      <div className='flexCenter h-screen relative z-10'>
        <img
          src={images[currentIndex]}
          className='p-10 md:p-[7rem] transition-opacity duration-700'
        />
        {totalImages > 1 && (
          <div className='absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full'>
            <span className='cursor-pointer pl-8' onClick={handlePrevious}>
              {currentIndex > 0 && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='50'
                  height='50'
                  viewBox='0 0 30 30'
                  fill='none'
                >
                  <path
                    d='M18.75 22.5L11.25 15L18.75 7.5'
                    stroke='white'
                    stroke-width='4'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              )}
            </span>
            <span className='cursor-pointer pr-8' onClick={handleNext}>
              {currentIndex < totalImages - 1 && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='50'
                  height='50'
                  viewBox='0 0 30 30'
                  fill='none'
                >
                  <path
                    d='M11.25 22.5L18.75 15L11.25 7.5'
                    stroke='white'
                    stroke-width='4'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
