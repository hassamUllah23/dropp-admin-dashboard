import { useState } from "react";

export default function Video({videoAvatar}) {
  const [likeVisible, setLikeVisible] = useState(true);
  const [dislikeVisible, setDislikeVisible] = useState(true);

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

  const handleDownload = () => {
    const anchor = document.createElement("a");
    anchor.href = videoAvatar;
    anchor.download = "video.mp4";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleShare = async () => {
  };
  return (
    <>
      <div className='pl-0 pr-2 md:px-5 pb-1  mt-3 md:mt-10'>
        <div>
          <div className=' flex space-x-2 items-start'>
            <div className='text-white flex justify-center items-center uppercase rounded-[1.4rem] w-8 md:w-12 mr-2 flex-30 md:flex-48'>
              <img
                src='/assets/images/chat/ai.png'
                alt='AiImage'
                className='w-8 md:w-12'
              />
            </div>
            <div className="w-full flex-1">

              <div className=' w-full bg-black p-10 rounded-xl flexCenter flex-1'>
                <video className=' max-w-52 md:max-w-96 downloadvideo' controls>
                  <source
                    src={videoAvatar}
                    type='video/mp4'
                  />
                </video>
              </div>
              
              <div className='flex justify-start gap-2 h-5 mt-2'>
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
                  className=' w-5 h-5 cursor-pointer' onClick={handleShare}
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
      </div>
    </>
  );
}
