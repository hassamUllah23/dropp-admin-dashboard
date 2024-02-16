const AISpinner = () => {
  return (
    <div className='pl-0 pr-2 md:px-5 pb-1 mt-3 md:mt-10 overflow-hidden'>
      <div>
        <div className=' flex space-x-2'>
          <div className='text-white flex justify-center items-center uppercase rounded-[1.4rem] w-8 md:w-12 mr-2 animate-spin  flex-30 md:flex-48'>
            <img
              src='/assets/images/chat/ai.png'
              alt='AiImage'
              className='w-8 md:w-12'
            />
          </div>
          <div className=" text-white w-full p-2 md:p-4 rounded-xl"><div></div></div>
        </div>
      </div>
    </div>
  );
};

export default AISpinner;
