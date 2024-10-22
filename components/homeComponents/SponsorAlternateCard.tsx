import React, { useContext, useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import LoadIcon from '../LoadIcon';
import Image from 'next/image';
import LogoContext from '@/lib/context/logo';
import { useDelayUnmount } from '@/lib/hooks';

interface SponsorCardProps {
  link: string;
  reference: string;
  alternativeReference: string;
}

const mountedStyle = { animation: 'inAnimation 250ms ease-in' };
const unmountedStyle = {
  animation: 'outAnimation 270ms ease-out',
  animationFillMode: 'forwards',
};

/**
 * Keynote Speaker card for landing page.
 */
export default function SponsorAlternateCard(props: SponsorCardProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [alternativeImgSrc, setAlternativeImgSrc] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [useAlternativeImg, setUseAlternativeImg] = useState(false);
  const { setCurrentHoveredLogo, currentHoveredLogo } = useContext(LogoContext);
  const shouldRenderAlternativeImg = useDelayUnmount(useAlternativeImg, 100);

  useEffect(() => {
    Promise.all(
      [
        { imgRef: props.reference, setImgFunc: setImgSrc },
        { imgRef: props.alternativeReference, setImgFunc: setAlternativeImgSrc },
      ].map(async ({ imgRef, setImgFunc }) => {
        if (imgRef !== undefined) {
          const storageRef = firebase.storage().ref();
          return storageRef
            .child(`sponsor_images/${imgRef}`)
            .getDownloadURL()
            .then((url) => {
              setImgFunc(url);
            });
        }
      }),
    )
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, []);

  if (loading) return <LoadIcon width={100} height={100} />;

  return (
    <div
      className={`my-4 p-3 w-[200px] h-[100px] lg:h-[200px] flex justify-center items-center hover:scale-110 hover:duration-300 ${
        currentHoveredLogo !== '' && currentHoveredLogo !== props.alternativeReference
          ? 'opacity-30'
          : 'opacity-100'
      } duration-500`}
      onTouchStart={() => {
        if (currentHoveredLogo === props.alternativeReference) {
          setCurrentHoveredLogo('');
        } else {
          setCurrentHoveredLogo(props.alternativeReference);
        }
      }}
      onMouseOver={() => {
        setCurrentHoveredLogo(props.alternativeReference);
        setUseAlternativeImg(true);
      }}
      onMouseOut={() => {
        setCurrentHoveredLogo('');
        setUseAlternativeImg(false);
      }}
    >
      <a href={props.link} target="_blank" className="" rel="noreferrer">
        {shouldRenderAlternativeImg ? (
          <Image
            alt={`Sponsor Image ${props.alternativeReference}`}
            src={alternativeImgSrc}
            width={150}
            height={150}
            layout="fixed"
            objectFit="contain"
            style={useAlternativeImg ? mountedStyle : unmountedStyle}
          />
        ) : (
          <Image
            alt={`Sponsor Image ${props.reference}`}
            src={imgSrc}
            width={150}
            height={150}
            layout="fixed"
            objectFit="contain"
          />
        )}
      </a>
      <br></br>
    </div>
  );
}
