import React, { useContext, useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import LoadIcon from '../LoadIcon';
import Image from 'next/image';
import LogoContext from '@/lib/context/logo';

interface SponsorCardProps {
  link: string;
  reference: string;
}

/**
 * Keynote Speaker card for landing page.
 */
export default function SponsorCard(props: SponsorCardProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const { setCurrentHoveredLogo, currentHoveredLogo } = useContext(LogoContext);

  useEffect(() => {
    if (props.reference !== undefined) {
      const storageRef = firebase.storage().ref();
      storageRef
        .child(`sponsor_images/${props.reference}`)
        .getDownloadURL()
        .then((url) => {
          setImgSrc(url);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error('Could not find matching image file');
        });
    }
  }, []);

  if (loading) return <LoadIcon width={100} height={100} />;

  return (
    <>
      {imgSrc !== undefined && (
        <div
          className={`p-3 w-[200px] h-[100px] lg:h-[200px] flex justify-center items-center hover:scale-110 hover:duration-300 ${
            currentHoveredLogo !== '' && currentHoveredLogo !== props.reference
              ? 'opacity-30'
              : 'opacity-100'
          } duration-500`}
          onTouchStart={() => {
            if (currentHoveredLogo === props.reference) {
              setCurrentHoveredLogo('');
            } else {
              setCurrentHoveredLogo(props.reference);
            }
          }}
          onMouseOver={() => {
            setCurrentHoveredLogo(props.reference);
          }}
          onMouseOut={() => {
            setCurrentHoveredLogo('');
          }}
        >
          <a href={props.link} target="_blank" className="" rel="noreferrer">
            <Image
              alt={`Sponsor Image ${props.reference}`}
              src={imgSrc}
              width={200}
              height={200}
              layout="fixed"
              objectFit="contain"
            />
          </a>
          <br></br>
        </div>
      )}
    </>
  );
}
