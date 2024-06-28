import React from "react";
import { RotatingLines } from 'react-loader-spinner';

export default function LoadingRotatingLines() {
  return (
    <RotatingLines
      visible={true}
      height='14'
      width='14'
      color='blue'
      strokeWidth='5'
      animationDuration='0.75'
      ariaLabel='rotating-lines-loading'
      wrapperStyle={{}}
      wrapperClass=''
      />
  );
}
