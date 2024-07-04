import React, { useState, useRef, useEffect } from 'react';

export default function UploadAssets({ onUploadCountChange, index }) {
  const [mediaList, setMediaList] = useState([]);
  const [showUploader, setShowUploader] = useState(true);
  const [uploadedImageCount, setUploadedImageCount] = useState(0);
  const fileInputRef = useRef();
  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const media = {
          id: Date.now(),
          type: determineFileType(file),
          dataURL: e.target.result,
        };
        setMediaList((prevMediaList) => [...prevMediaList, media]);
        setUploadedImageCount((prevCount) => prevCount + 1);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (uploadedImageCount === 0) {
      setShowUploader(true);
    } else {
      setShowUploader(false);
    }
    onUploadCountChange(uploadedImageCount);
  }, [uploadedImageCount]);

  const handleRemoveMedia = (id) => {
    setMediaList((prevMediaList) => {
      const removedMedia = prevMediaList.find((media) => media.id === id);
      return prevMediaList.filter((media) => media.id !== id);
    });
    setUploadedImageCount((prevCount) => prevCount - 1);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const determineFileType = (file) => {
    if (file.type.startsWith('image')) {
      return 'image';
    } else if (file.type.startsWith('video')) {
      return 'video';
    } else if (file.name.endsWith('.obj') || file.name.endsWith('.stl')) {
      return '3d-model';
    } else if (file.name.endsWith('.gltf')) {
      return '3d-model-gltf';
    } else {
      return 'unknown';
    }
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div className='pl-0 pr-2 md:px-5 pb-1 mt-3 md:mt-10 text-white'>
        <div>
          <div className=' flex space-x-2'>
            <div className='text-white flex justify-center items-center uppercase rounded-[1.4rem] w-8 md:w-12 mr-2'>
              <img
                src='/assets/images/chat/ai.png'
                alt='AiImage'
                className='w-8 md:w-12'
              />
            </div>
            <div className='w-full'>
              <div className=' p-3 md:p-14 relative bg-no-repeat bg-cover bgGrayImage'>
                <div className=' absolute top-2 right-2 md:top-3 md:right-3 cursor-pointer'>
                  <img
                    src='/assets/images/chat/info.svg'
                    className=' w-4 h-4 md:w-7 md:h-7 hidden'
                  />
                </div>

                {showUploader && (
                  <div
                    className='flex justify-center items-center cursor-pointer uploadAsset'
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={openFileDialog}
                  >
                    <div className='flex flex-col items-center'>
                      <input
                        type='file'
                        accept='image/*,video/*,.obj,.stl,.gltf'
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className='hidden'
                      />
                      <img
                        src='/assets/images/auth/upload.png'
                        alt='upload'
                        className=' w-28 h-28  mx-auto'
                      />
                      <p className='pt-5'>Upload assets here...</p>
                    </div>
                  </div>
                )}

                <div className='media-container max-w-[32rem] m-auto text-center'>
                  {mediaList.map((media, index) => (
                    <div
                      key={index}
                      className='media-item inline-block w-16 h-16 md:w-36 md:h-36 mx-2 my-1 md:mx-3 md:my-3 rounded-md relative'
                    >
                      {media.type === 'image' ? (
                        <img
                          src={media.dataURL}
                          alt='uploaded-img'
                          className='w-16 h-16 md:w-36 md:h-36 rounded-md object-cover '
                        />
                      ) : media.type === 'video' ? (
                        <video
                          controls
                          className='w-16 h-16 md:w-36 md:h-36 rounded-md object-cover '
                        >
                          <source src={media.dataURL} type='video/mp4' />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div>
                          {media.type === '3d-model' && (
                            <p>3D Model (OBJ/STL)</p>
                          )}
                          {media.type === '3d-model-gltf' && (
                            <p>3D Model (GLTF)</p>
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveMedia(media.id)}
                        className='absolute top-2 right-2 cursor-pointer bg-transparent'
                      >
                        <img
                          src='/assets/images/chat/remove.png'
                          className=' w-3'
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
