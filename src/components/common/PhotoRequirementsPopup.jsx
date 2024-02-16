import Image from 'next/image'

export default function PhotoRequirementsPopup() {
  return (
    <div className=' absolute top-4 right-4 md:top-12 md:right-4 cursor-pointer text-xs z-10 bg-white text-black px-1.5 py-2 rounded-md'>
        <p className='pb-1'>Photo requirements for optimized results.</p>
        <div className='flex'>
            <Image src="/assets/images/chat/human.png" width={90} height={100} alt="human" className='flex mr-1 rounded-sm' style={{'flex-grow':'80px' }} />
            <div className='flex flex-grow flex-col text-[.7rem]'>
              <label className='flex items-center py-1'>
                  <img src='/assets/images/chat/greenTick.svg' alt='tick' className='w-2.5 mx-1' />
                  <span>Medium shot, frontal facing</span>
              </label>
              <label className='flex items-center py-1'>
                <img src='/assets/images/chat/greenTick.svg' alt='tick' className='w-2.5 mx-1' />
                <span>Neutral facing expression, closed mouth</span>
              </label>
              <label className='flex items-center py-1'>
                <img src='/assets/images/chat/greenTick.svg' alt='tick' className='w-2.5 mx-1' />
                <span>Minimal head size within the image - 200x200 pixels</span>
              </label>
              <label className='flex items-center py-1'>
                <img src='/assets/images/chat/greenTick.svg' alt='tick' className='w-2.5 mx-1' />
                <span>Good and solid lighting</span>
              </label>
              <label className='flex items-center py-1'>
                <img src='/assets/images/chat/greenTick.svg' alt='tick' className='w-2.5 mx-1' />
                <span>Size - upto 10 MB</span>
              </label>
              <label className='flex items-center py-1'>
                <img src='/assets/images/chat/redX.svg' alt='tick' className='w-2.5 mx-1' />
                <span>No face occlusions</span>
              </label>
            </div>
        </div>
    </div>
  )
}
