/* eslint-disable react/no-children-prop */
"use client";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeMathjax from 'rehype-mathjax';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import { dracula, CopyBlock } from 'react-code-blocks';

const StreamingChatBox = ({ data, index }) => {
  const [copied, setCopied ] = useState(false);
  const [likeVisible, setLikeVisible] = useState(true);
  const [dislikeVisible, setDislikeVisible] = useState(true);
  const handleCopy = () => {
    const contentToCopy = document.getElementById(`contentToCopy${index}`);
    const textArea = document.createElement('textarea');
    textArea.value = contentToCopy.innerText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleLikeClick = () => {
    if (dislikeVisible) {
      setLikeVisible(true);
      setDislikeVisible(false);
    }
  };

  const handleDislikeClick = () => {
    if (likeVisible) {
      setDislikeVisible(true);
      setLikeVisible(false);
    }
  };
  useEffect(() => {

  },[])
  return (
    <div className='pl-0 pr-2 md:px-5 pb-1 mt-3 md:mt-10'>
      
        <div className=' flex space-x-2'>
          <div className='text-white flex justify-center items-start uppercase rounded-[1.4rem] w-8 md:w-12 mr-2 flex-30 md:flex-48'>
            <img
              src='/assets/images/chat/ai.png'
              alt='AiImage'
              className='w-8 md:w-12'
            />
          </div>
          <div className='w-full flex-1'>
            <div className='bg-[#5f6369] text-white w-full p-2 md:p-4 rounded-xl leading-6' dir={data.textType === "arabic" ? "rtl" : "ltr"} id={`contentToCopy${index}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeMathjax, rehypeRaw]}
                children={data.answer}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    if (!inline && match) {
                      const codeString = String(children);
                      return (
                        <CopyBlock
                          text={codeString}
                          language={match[1]}
                          showLineNumbers={false}
                          wrapLongLines
                          theme={dracula}
                          {...props}
                        />
                      );
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  table({ children, ...props }) {
                    return (
                      <table
                        style={{
                          borderCollapse: 'collapse',
                          width: '100%',
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '14px',
                        }}
                        {...props}
                      >
                        {children}
                      </table>
                    );
                  },
                  tr({ children, ...props }) {
                    return (
                      <tr style={{ backgroundColor: '#f8f8f8' }} {...props}>
                        {children}
                      </tr>
                    );
                  },
                  td({ children, ...props }) {
                    return (
                      <td
                        style={{ padding: '8px', border: '1px solid #ddd' }}
                        {...props}
                      >
                        {children}
                      </td>
                    );
                  },
                  th({ children, ...props }) {
                    return (
                      <th
                        style={{
                          padding: '8px',
                          border: '1px solid #ddd',
                          fontWeight: 'bold',
                          textAlign: 'left',
                        }}
                        {...props}
                      >
                        {children}
                      </th>
                    );
                  },
                  a({ href, children, ...props }) {
                    return (
                      <a
                        style={{ color: '#007bff', textDecoration: 'none' }}
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  p({ children, ...props }) {
                    return (
                      <div {...props} style={{ whiteSpace: 'pre-wrap' }}>
                        {children}
                      </div>
                    );
                  },
                }}
              />
            </div>

                {data?.isDone && (
                  <div className='flex justify-start gap-2 h-5 mt-2'>
                    {!copied ? (
                      <img
                        src="/assets/images/chat/doc.png"
                        className="w-5 h-5 cursor-pointer"
                        onClick={handleCopy}
                        alt="Copy to Clipboard"
                      />
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 1L6 12L1 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}

                    {likeVisible && (
                      <img
                        src='/assets/images/chat/thumb_up.png'
                        className=' w-5 h-5 cursor-pointer like '
                        onClick={handleLikeClick}
                      />
                      )}
                      {dislikeVisible && (
                        <img
                          src='/assets/images/chat/thumb_down.png'
                          className=' w-5 h-5 cursor-pointer dislike'
                          onClick={handleDislikeClick}
                        />
                      )}
                    <img
                      src='/assets/images/chat/reset.png'
                      className=' w-5 h-5 cursor-pointer'
                    />
                    <img
                      src='/assets/images/chat/comment.png'
                      className=' w-5 h-5 cursor-pointer'
                    />
                  </div>
                )}
            

          </div>
        </div>
      
    </div>
  );
};

export default StreamingChatBox;
