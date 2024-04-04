import React, { useEffect, useState } from 'react';

export default function VideoUrl({ url }) {
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    setKey(Date.now());
  }, [url]);

  return (
    <div className='media-item inline-block mx-2 my-1 md:mx-3 md:my-3 rounded-md relative'>
      <video
        key={key}
        controls
        className=' max-w-56 md:max-w-96 rounded-md object-cover '
      >
        <source src={url} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
