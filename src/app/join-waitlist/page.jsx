'use client';
import React from 'react';
import WaitListForm from '@/components/waitlist/WaitListForm';
import Footer from '@/partials/footer/Footer';

const JoinWaitList = () => {
  return (
    <div className='flex flex-col h-full'>
      <div className='relative z-10 flex items-center justify-center flex-grow'>
        <div className='max-w-[36rem] w-full relative overflow-hidden m-auto flex flex-col justify-center items-start text-white p-8 bg-black rounded-2xl'>
          <WaitListForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JoinWaitList;
