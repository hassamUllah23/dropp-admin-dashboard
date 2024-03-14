import React from 'react';

const GetInitials = ({ fullName }) => {
  const getInitials = (fullName) => {
    const words = fullName?.split(' ');
    const initials = words.map((word) => word.charAt(0).toUpperCase()).join('');
    return initials;
  };

  return <div>{getInitials(fullName)}</div>;
};

export default GetInitials;
