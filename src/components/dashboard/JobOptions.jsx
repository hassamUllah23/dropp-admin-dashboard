import React from 'react'

export default function JobOptions({platform}) {
  return (
    <div className='lightGrayBg absolute text-white py-2 px-4 rounded-2xl top-8 right-2 flex flex-col text-sm font-normal w-40 cursor-pointer '>
        <div className='flex items-center py-2 group'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:text-[#F04141]">
                <path d="M10.3866 7.99999C10.3866 9.31999 9.31995 10.3867 7.99995 10.3867C6.67995 10.3867 5.61328 9.31999 5.61328 7.99999C5.61328 6.67999 6.67995 5.61333 7.99995 5.61333C9.31995 5.61333 10.3866 6.67999 10.3866 7.99999Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.9999 13.5133C10.3532 13.5133 12.5466 12.1267 14.0732 9.72666C14.6732 8.78666 14.6732 7.20666 14.0732 6.26666C12.5466 3.86666 10.3532 2.48 7.9999 2.48C5.64656 2.48 3.45323 3.86666 1.92656 6.26666C1.32656 7.20666 1.32656 8.78666 1.92656 9.72666C3.45323 12.1267 5.64656 13.5133 7.9999 13.5133Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span className='inline-block pl-2 group-hover:text-[#F04141]'>View Chat</span>
        </div>

        <div className='flex items-center py-2'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M11.3335 8.59999V11.4C11.3335 13.7333 10.4002 14.6667 8.06683 14.6667H5.26683C2.9335 14.6667 2.00016 13.7333 2.00016 11.4V8.59999C2.00016 6.26666 2.9335 5.33333 5.26683 5.33333H8.06683C10.4002 5.33333 11.3335 6.26666 11.3335 8.59999Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.3335 4.6V7.4C15.3335 9.73333 14.4002 10.6667 12.0668 10.6667H11.3335V8.59999C11.3335 6.26666 10.4002 5.33333 8.06683 5.33333H6.00016V4.6C6.00016 2.26666 6.9335 1.33333 9.26683 1.33333H12.0668C14.4002 1.33333 15.3335 2.26666 15.3335 4.6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span className='inline-block pl-2 '>Duplicate Chat</span>
        </div>


        <div className='flex items-center py-2'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M14 3.98667C11.78 3.76667 9.54667 3.65334 7.32 3.65334C6 3.65334 4.68 3.72 3.36 3.85334L2 3.98667" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.6665 3.31334L5.81317 2.44C5.91984 1.80667 5.99984 1.33334 7.1265 1.33334H8.87317C9.99984 1.33334 10.0865 1.83334 10.1865 2.44667L10.3332 3.31334" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12.5664 6.09333L12.1331 12.8067C12.0598 13.8533 11.9998 14.6667 10.1398 14.6667H5.85977C3.99977 14.6667 3.93977 13.8533 3.86644 12.8067L3.43311 6.09333" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.88672 11H9.10672" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.3335 8.33334H9.66683" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span className=' inline-block pl-2 '>Delete Chat</span>
        </div>
    </div>
  )
}
