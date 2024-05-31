"use client"
import { useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import useApiHook from "@/hooks/useApiHook";
import { toast } from 'react-toastify';
const BalanceEditor = ({ employee, index, handleInputChange, handleBalanceSave, handleCancel }) => {
  const [isEditing, setIsEditing] = useState(employee.isEditing);
  const [employeeBalance, setEmployeeBalance] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const { handleApiCall } = useApiHook();
  const saveBalance = async (item, index) => {
    if (employeeBalance === 0) return;
    setShowLoading(true)
    const result = await handleApiCall({
      method: "PUT",
      url: `/balance/update`,
      data: {
        userId: item._id,
        balance: employeeBalance,
      },
    });
    console.log(result);
    if (result.status === 200) {
      
        handleBalanceSave()
        setTimeout(() => {
            setShowLoading(false)
            setIsEditing(false)
            toast.success(result.data.message); 
            setEmployeeBalance(0)   
        }, 1000);
        
    } else {
        setShowLoading(false)
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className='relative group cursor-pointer'>
      <div className='flex gap-2 items-center'>
        {isEditing ? (
          <input
            type='number'
            onChange={(e) => setEmployeeBalance(e.target.value)}
            autoFocus
            value={employeeBalance}
            className='bg-[#0C0C0C] rounded-[4px] p-3'
          />
        ) : (
          <div className='flex gap-[5px] items-center'>
            <span className='text-[14px] leading-[16.1px]'>
              {employee?.balance}
            </span>
          </div>
        )}
        {isEditing ? (
          <div className='flex gap-2'>
            <button onClick={() => { handleCancel(index); toggleEditing(); }}>
              <img
                src='/close-square.svg'
                alt='close-button'
                width={32}
                height={32}
              />
            </button>
            {showLoading ? (
              <div className='flex justify-center items-center'>
                <RotatingLines
                  height='20'
                  width='20'
                  color='gray'
                  strokeColor='white'
                  strokeWidth='5'
                  animationDuration='0.75'
                  ariaLabel='rotating-lines-loading'
                />
              </div>
            ) : (
              <button onClick={() => saveBalance(employee, index)}>
                <img
                  src='/tick-square.svg'
                  alt='save-button'
                  width={32}
                  height={32}
                />
              </button>
            )}
          </div>
        ) : (
          <div className='absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center'>
            <button onClick={toggleEditing} className='w-[21.33px] h-[21.33px]'>
              <img
                src='/edit-2.svg'
                alt='edit-button'
                width={21.33}
                height={21.33}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceEditor;
