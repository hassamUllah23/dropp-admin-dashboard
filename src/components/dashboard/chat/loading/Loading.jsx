export default function Loading() {
  return (
    <>
      <div className='pl-0 pr-2 md:px-5 pb-1  mt-3 md:mt-10'>
        <div>
          <div className=' flex space-x-2 items-start'>
            <div className='text-white flex justify-center animate-spin items-start uppercase rounded-[1.4rem] w-8 md:w-12 mr-2 flex-30 md:flex-48'>
              <img
                src='/assets/images/chat/ai.png'
                alt='AiImage'
                className='w-8 md:w-12'
              />
            </div>
            <div className=' w-full bg-black p-6 md:p-10 rounded-xl flexCenter flex-1'>
             <img src="/assets/gif/loading.gif" alt="loading" className=" max-w-52 md:max-w-96"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
