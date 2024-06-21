'use client';
import RewardsForm from '@/components/dashboard/rewards/RewardsForm';

export default function page() {
  const deleteMyAccount = () => {};
  return (
    <div className='divide-y divide-white/5 w-full mx-auto p-2.5  max-w-7xl'>
      <div className='grid w-full grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
        <div>
          <h2 className='text-base font-semibold leading-7 text-white'>
            Rewards Information
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-400'>
            
          </p>
        </div>

        <RewardsForm />
      </div>
    </div>
  );
}
