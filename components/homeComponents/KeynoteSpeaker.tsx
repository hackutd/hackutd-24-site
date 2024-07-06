import Image from 'next/image';
import { useEffect, useState } from 'react';
import 'firebase/storage';
import firebase from 'firebase/compat/app';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';

/**
 * Keynote Speaker card for landing page.
 */
export default function KeynoteSpeaker(props) {
  const [imageLink, setImageLink] = useState<string | undefined>();

  useEffect(() => {
    if (props.imageLink !== undefined) {
      const storageRef = firebase.storage().ref();
      storageRef
        .child(`speaker_images/${props.imageLink}`)
        .getDownloadURL()
        .then((url) => {
          setImageLink(url);
        })
        .catch((error) => {
          console.error('Could not find matching image file');
        });
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-72 md:w-[360px] h-[350px] md:h-[420px] rounded-3xl relative overflow-hidden border-2 border-gray-300 font-inter bg-white">
      <div className="rounded-t-sm">
        {props.imageLink !== undefined && imageLink !== undefined && (
          <Image src={imageLink} width={360} height={240} objectFit="cover" alt="" />
        )}
      </div>
      <div className="flex-col items-center justify-center w-full h-80 absolute translate-y-48 md:translate-y-60 pt-3">
        <div className="px-8 md:px-6">
          <div className="text-xl font-semibold pb-1">{props.name}</div>
          <div className="text-md font-normal pb-1 text-[#3E3E59]">{props.subtitle}</div>
          <div className="text-xs pb-2 text-[#5F6980]">{props.description}</div>
          <div className="flex space-x-3 md:pt-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#9CA6FF]">
              <a href={props.linkedinLink} target="_blank" rel="noreferrer">
                <LinkedInIcon style={{ fontSize: 29, color: 'white' }} />
              </a>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#9CA6FF]">
              <a href={props.githubLink} target="_blank" rel="noreferrer">
                <GitHubIcon style={{ fontSize: 29, color: 'white' }} />
              </a>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#9CA6FF]">
              <a href={props.websiteLink} target="_blank" rel="noreferrer">
                <LanguageIcon style={{ fontSize: 29, color: 'white' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
