import React, { useState } from 'react';
import LargeImageView from './LargeImageView';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export default function ModalView({ generationImage }) {
  const [showLargeView, setShowLargeView] = useState(false);
  const [largeImageSrc, setLargeImageSrc] = useState('');
  const [likeVisible, setLikeVisible] = useState(true);
  const [dislikeVisible, setDislikeVisible] = useState(true);
  const handleClick = (imageSrc) => {
    setShowLargeView(true);
    setLargeImageSrc(imageSrc);
  };

  const handleDownload = () => {
    if (generationImage.length === 1) {
      const imageUrl = generationImage[0];
      downloadImage(imageUrl, 'image.png');
    } else {
      const zip = new JSZip();
      const fetchPromises = [];

      generationImage.forEach((imageUrl, index) => {
        const fetchPromise = fetch(imageUrl)
          .then((response) => response.blob())
          .then((blob) => zip.file(`image${index + 1}.png`, blob));

        fetchPromises.push(fetchPromise);
      });

      Promise.all(fetchPromises)
        .then(() => zip.generateAsync({ type: 'blob' }))
        .then((content) => {
          saveAs(content, 'images.zip');
        });
    }
  };

  const downloadImage = (imageUrl) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => saveAs(blob, 'image.png'));
  };

  const handleLikeClick = () => {
    if (dislikeVisible) {
      setLikeVisible(true);
      setDislikeVisible(false);
    }
  };

  const handleDislikeClick = () => {
    if (likeVisible) {
      setDislikeVisible(true);
      setLikeVisible(false);
    }
  };

  return (
    <div className='pl-0 pr-2 md:px-5 pb-1 mt-3 md:mt-10'>
      <div>
        <div className='flex space-x-2'>
          <div className='text-white flex justify-center items-start uppercase rounded-[1.4rem] w-8 md:w-12 mr-2 flex-30 md:flex-48'>
            <img
              src='/assets/images/chat/ai.png'
              alt='AiImage'
              className='w-8 md:w-12'
            />
          </div>
          <div className='w-full flex-1'>
            <div className='w-full bg-no-repeat bg-cover bgGrayImage p-2 md:p-4  rounded-xl flexCenter'>
              <div className='w-full flex justify-center'>
                {generationImage?.length > 0 && (
                  <div
                    className={
                      generationImage?.length === 1
                        ? 'grid grid-cols-1 gap-8 p-4 md:p-10 justify-center allImages'
                        : 'grid grid-cols-2 gap-8 p-4 md:p-10 justify-center allImages'
                    }
                  >
                    {generationImage?.map((imageUrl) => (
                      <img
                        key={imageUrl}
                        src={imageUrl}
                        className=' w-full h-auto rounded-sm'
                        onClick={() => handleClick(imageUrl)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className='flex justify-start gap-2 h-5 mt-2'>
              <img
                src='/assets/images/chat/doc.png'
                className=' w-5 h-5 cursor-pointer'
              />
              {likeVisible && (
                <img
                  src='/assets/images/chat/thumb_up.png'
                  className=' w-5 h-5 cursor-pointer like '
                  onClick={handleLikeClick}
                />
              )}
              {dislikeVisible && (
                <img
                  src='/assets/images/chat/thumb_down.png'
                  className=' w-5 h-5 cursor-pointer dislike'
                  onClick={handleDislikeClick}
                />
              )}
              <img
                src='/assets/images/chat/reset.png'
                className=' w-5 h-5 cursor-pointer'
              />
              <img
                src='/assets/images/chat/comment.png'
                className=' w-5 h-5 cursor-pointer'
              />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                onClick={handleDownload}
                className='cursor-pointer'
              >
                <path
                  d='M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15'
                  stroke='#FFFFFF'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M7 10L12 15L17 10'
                  stroke='#FFFFFF'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12 15V3'
                  stroke='#FFFFFF'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {showLargeView && (
        <LargeImageView
          imageSrc={largeImageSrc}
          onClose={() => setShowLargeView(false)}
          images={generationImage}
        />
      )}
    </div>
  );
}
