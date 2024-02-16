import Link from 'next/link';

const Footer = () => {
  return (
    <div className='flex justify-center p-3 text-gray-50 text-center text-sm lg:text-base'>
      <Link
        className='text-white font-semibold hover:text-blue-700 hover:cursor-pointer'
        href='/'
      >
        Home
      </Link>
      <span className='mx-3 block text-white'>|</span>
      <Link
        className='text-white font-semibold hover:text-blue-700'
        href='/privacy'
      >
        Privacy Policy
      </Link>
      <span className='mx-3 block text-white'>|</span>
      <Link
        className='text-white font-semibold hover:text-blue-700'
        href='/terms'
      >
        Terms of Service
      </Link>
      <span className='mx-3 block text-white'>|</span>
      <Link
        className='text-white font-semibold hover:text-blue-700'
        href='/cookie'
      >
        Cookie Policy
      </Link>
    </div>
  );
};

export default Footer;
