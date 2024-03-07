'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import useApiHook from '@/hooks/useApiHook';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { RotatingLines } from 'react-loader-spinner';
import { forgotPasswordSchema } from '@/schema/auth/authSchema';

const ForgotPassword = () => {
  const router = useRouter();
  const userId = router?.query?.userId;
  const { handleApiCall, isApiLoading } = useApiHook();

  const handleResetPassword = async (values) => {
    const result = await handleApiCall({
      method: 'post',
      url: '/auth/forgot-password',
      data: values,
    }).then((res) => {
      if (res?.status === 200) {
        toast.success('Reset password email sent successfully.');
        router.push('/sign-in');
      }
      return res;
  }).catch((error) => {
      toast.error(error?.response?.data?.errors);
  });
  };

  return (
    <div className='relative z-10 flex items-center justify-center max-w-[37rem] h-full m-auto  px-5 md:px-0'>
      <div className='relative overflow-hidden m-auto flex flex-col justify-center items-start w-full text-white p-8 charcoalBg rounded-2xl border border-gray-100'>
        <p className='md:text-6xl text-base font-bold pt-0 md:pt-5 text-center max-w-[20.5rem] m-auto leading-6 md:leading-8'>
          Enter email to get reset password link
        </p>
        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleResetPassword}
        >
          <Form className='w-full text-white text-sm md:text-base pt-2 md:pt-4 relative z-10'>
            <div className='w-full'>
              <div className='w-full float-left'>
                <label className='w-full block pt-2 pb-3'>
                  Email<span className='text-red-600'> *</span>
                </label>
                <Field
                  type='text'
                  name='email'
                  placeholder='Enter email here'
                  className='email mb-3 text-gray-700 text-base w-full leading-3 md:leading-5 py-3 md:py-4 px-3 rounded-2xl border border-solid bg-black border-lightGray-200 bg-black-200'
                />
                <ErrorMessage
                  name='email'
                  component='div'
                  className='text-red-600'
                />
              </div>
            </div>
            <div className='w-full float-left pt-4'>
              <button
                type='submit'
                className='sendlink btn-Gradient text-base text-black w-full leading-3 md:leading-5 py-3 md:py-4 text-center rounded-2xl cursor-pointer font-semibold flex items-center justify-center'
              >
                {isApiLoading ? (
                  <RotatingLines
                    visible={true}
                    height='14'
                    width='14'
                    color='blue'
                    strokeWidth='5'
                    animationDuration='0.75'
                    ariaLabel='rotating-lines-loading'
                  />
                ) : (
                  <p>Send link</p>
                )}
              </button>
            </div>
            <p className='pt-6 float-left text-center w-full'>
              <Link href='/sign-in' className='text-white back-to-login'>
                Back to login
              </Link>
            </p>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
