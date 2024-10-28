import LogoContext from '@/lib/context/logo';
import { useDelayUnmount } from '@/lib/hooks';
import clsx from 'clsx';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import LoadIcon from '../LoadIcon';

interface SponsorCardProps {
  link: string;
  reference: string;
  alternativeReference?: string;
}

const mountedStyle = { animation: 'inAnimation 250ms ease-in' };
const unmountedStyle = {
  animation: 'outAnimation 270ms ease-out',
  animationFillMode: 'forwards',
};

/**
 * Keynote Speaker card for landing page.
 */
export default function SponsorCard(props: SponsorCardProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [alternativeImgSrc, setAlternativeImgSrc] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(true);
  const [hovering, setHovering] = useState(false);

  const { setCurrentHoveredLogo, currentHoveredLogo } = useContext(LogoContext);

  const shouldRenderAlternativeImg = useDelayUnmount(hovering && Boolean(alternativeImgSrc), 100);

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
      className={clsx(
        `my-4 p-3 w-[250px] h-[150px] flex justify-center items-center hover:scale-110 hover:duration-300  duration-500 opacity-100`,
        {
          ['opacity-30']: currentHoveredLogo.length !== 0 && currentHoveredLogo !== props.reference,
        },
      )}
      onTouchStart={() => {
        if (currentHoveredLogo === props.reference) {
          setCurrentHoveredLogo('');
        } else {
          setCurrentHoveredLogo(props.reference);
        }
      }}
      onMouseOver={() => {
        setCurrentHoveredLogo(props.reference);
        setHovering(true);
      }}
      onMouseOut={() => {
        setCurrentHoveredLogo('');
        setHovering(false);
      }}
    >
      <a href={props.link} target="_blank" rel="noreferrer">
        {shouldRenderAlternativeImg ? (
          <Image
            alt={`Sponsor Image ${props.alternativeReference}`}
            src={alternativeImgSrc}
            width={200}
            height={200}
            layout="fixed"
            objectFit="contain"
            style={hovering ? mountedStyle : unmountedStyle}
            className={'w-[250px] h-[150px] object-contain'}
          />
        ) : (
          <Image
            alt={`Sponsor Image ${props.reference}`}
            src={imgSrc}
            width={200}
            height={200}
            layout="fixed"
            objectFit="contain"
            className={'w-[250px] h-[150px] object-contain'}
          />
        )}
      </a>
      <br></br>
    </div>
  );
}
