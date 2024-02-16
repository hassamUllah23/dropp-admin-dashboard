import React from 'react';

const GetInitials = ({ fullName }) => {
  const getInitials = (fullName) => {
    const initials = fullName ? fullName?.charAt(0).toUpperCase() : 'A';
    return initials;
  };

  return <div>{getInitials(fullName)}</div>;
};

export default GetInitials;
