import React from 'react'

export default function AssignJob({employees}) {
    

  return (
    <div className=' py-2 px-3 bgDarkGray rounded-lg text-white'>
        {employees.map((employee) => (
            <div className='flex items-center justify-start py-1'>
            {/* <input type='checkbox' checked={employee.assigned} id={employee.id} name='employees' className='w-4 h-4 mr-2 text-black-600 rounded-lg acknowledge' /> */}
            <div className='flex flex-start items-center'>
                <img src={employee.image} alt="userImage" className=' w-6 h-6 rounded-full' />
                <label className=' text-xs font-normal ml-2 cursor-pointer' htmlFor={employee.id}>{employee.name}</label>
            </div>
        </div>
        ))}
    </div>
  )
}
