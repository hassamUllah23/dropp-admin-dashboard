'use client';
import Script from 'next/script';

const WaitListForm = () => {
  return (
    <>
      <Script
        type='text/javascript'
        data-campaign-id='ri2WKdqc3tUSWUZUVz4HEL2UR0o'
        src='https://app.viral-loops.com/widgetsV2/core/loader.js'
      ></Script>
      <form-widget ucid='ri2WKdqc3tUSWUZUVz4HEL2UR0o'></form-widget>
    </>
  );
};

export default WaitListForm;
