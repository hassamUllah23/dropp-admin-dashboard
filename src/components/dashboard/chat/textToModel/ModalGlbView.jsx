import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Preload, useGLTF, Stage, PresentationControls } from "@react-three/drei";
import { useLoader, useThree, useFrame } from 'react-three-fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { useProgress, Html } from "@react-three/drei";
import LoadingSvg from "@/components/common/LoadingSvg";

export default function ModalGlbView({modelGlb}) {
 
  const [likeVisible, setLikeVisible] = useState(true);
  const [dislikeVisible, setDislikeVisible] = useState(true);
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
  const handleDownload = () => {
    const anchor = document.createElement("a");
    anchor.href = modelGlb; 
    anchor.download = "3d_model.glb"; 
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };
  

  return (
    <div className='pl-0 pr-2 md:px-5 pb-1  mt-3 md:mt-10'>

      <div>
        <div className='flex space-x-2'>
          <div className='text-white flex justify-center items-start uppercase rounded-[1.4rem] w-8 md:w-12 mr-2 flex-30 md:flex-48'>
            <img
              src='/assets/images/chat/ai.png'
              alt='AiImage'
              className='w-8 md:w-12 '
            />
          </div>
          <div className='w-full flex-1'>
            <div className='w-full bg-no-repeat bg-cover bgGrayImage p-2 md:p-10 rounded-xl flexCenter'>
            <div className="h-52 md:h-96 canvas w-full">
              <Canvas style={{ width: "100%", height: "100%" }}>
                <>
                  <PerspectiveCamera makeDefault position={[0, 0.5, 1]} />
                  <OrbitControls />

                  <ambientLight intensity={0.9} />
                  <directionalLight position={[2, 2, 2]} intensity={6.0} />
                  <directionalLight position={[-2, 2, 2]} intensity={6.0} />

                  <directionalLight position={[3, -3, -3]} intensity={6.0} />
                  <directionalLight position={[-3, 3, -3]} intensity={6.0} />
                  <Suspense fallback={<Loader />}>
                    <ModelViewer modelPath={modelGlb} scale={0.5} />
                  </Suspense>
                </>
              </Canvas>
              </div>
            </div>

            <div className='flex justify-start gap-2 h-5 mt-2 actionsIcons'>
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
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                className='cursor-pointer'
                onClick={handleDownload}
              >
                <path
                  d='M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15'
                  stroke='#FFFFFF'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M7 10L12 15L17 10'
                  stroke='#FFFFFF'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M12 15V3'
                  stroke='#FFFFFF'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{width: '100%'}} className="text-white w-full flexCenter flex-col max-w-96">
        <p className="text-green-700 pb-3 text-xl font-semibold">Processing...</p>
        <LoadingSvg  color={'#ffffff'} />
        {/* <img src="/assets/gif/generatingModel.gif" alt="loading" className="w-full"/> */}
      </div>
    </Html>
  );
}

const ModelViewer = ({ modelPath }) => {

  const gltf = useLoader(GLTFLoader, modelPath);
  const modelRef = useRef();
  const { camera, gl } = useThree();

  // Setup OrbitControls
  const controls = useRef();
  useFrame(() => controls.current.update());

  return (
    <>
      <primitive ref={modelRef} object={gltf.scene} />
      <OrbitControls ref={controls} args={[camera, gl.domElement]} />
    </>
  );
};
