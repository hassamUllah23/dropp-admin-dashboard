import Link from 'next/link';

export default function Waitlist() {
  return (
    <div className='flex flex-col justify-center h-full items-center text-white min-w-80 p-5'>
      <p className='text-3xl 2xl:text-8xl mb-8 text-center px-4'>
        We are having a phased roll-out. So…
      </p>
      <Link
        href='/sign-in'
        className='max-w-[400px] w-full btn-Gradient text-base text-black spacing text-center rounded-2xl cursor-pointer font-semibold'
      >
        Sign In
      </Link>
    </div>
  );
}
