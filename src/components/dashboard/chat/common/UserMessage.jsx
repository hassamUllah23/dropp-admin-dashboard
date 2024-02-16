import GetInitials from '@/components/common/GetInitials';
import { selectAuth, useSelector } from '@/lib';
export default function UserMessage({ message }) {
  const auth = useSelector(selectAuth);
  let fullName = auth?.userInfo?.user?.firstName + ' ' + auth?.userInfo?.user?.lastName;
  return (
    <>
      <div className='pl-0 pr-2 md:px-5 pb-1 mt-3 md:mt-10'>
        <div>
          <div className=' flex space-x-2'>
            <div className='  text-white flex justify-center items-start uppercase rounded-[1.4rem] w-8 md:w-12 mr-2  flex-30 md:flex-48'>

            {auth?.userInfo?.user?.avatar == null ? (
              <span className=' w-[1.85rem] h-[1.85rem] md:w-12 md:h-12 text-xs md:text-base rounded-full text-black flexCenter font-semibold bg-slate-200'>
                  <GetInitials fullName={fullName} />
              </span>
            ) : (
              <img
                src='/assets/images/chat/UserImg.png'
                alt='userImage'
                className='w-8 md:w-12'
              />
            )}

              
            </div>
            <div className='bg-[#5f6369] text-white w-full p-2 md:p-4 rounded-xl flex-1'>
              <div>{message}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
