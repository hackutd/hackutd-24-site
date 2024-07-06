import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import KeynoteSpeaker from './KeynoteSpeaker';

export default function HomeSpeakers(props: { keynoteSpeakers: KeynoteSpeaker[] }) {
  const [speakers, setSpeakers] = useState<KeynoteSpeaker[]>([]);

  useEffect(() => {
    setSpeakers(props.keynoteSpeakers);
  }, []);

  return (
    speakers.length != 0 && (
      <section className=" overflow-x-auto min-h-[24rem] bg-[#F2F3FF] pb-20">
        <div className="text-center text-4xl md:text-5xl font-bold text-[#05149C] pt-8 pb-2 font-fredoka">
          Speakers
        </div>
        <div className="text-center text-sm md:text-md pb-8 font-dmSans">
          The members that make HackPortal possible
        </div>

        <div className="md:px-40">
          <Swiper
            navigation={true}
            modules={[Navigation]}
            className="mySwiper"
            slidesPerView={1}
            spaceBetween={5}
            // Responsive breakpoints
            breakpoints={{
              // when window width is >= 320px
              320: {
                slidesPerView: 1,
                spaceBetween: 5,
              },
              // when window width is >= 480px
              480: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              620: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              // when window width is >= 640px
              840: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
            }}
          >
            {speakers.map(
              (
                { name, subtitle, description, fileName, githubLink, linkedinLink, websiteLink },
                idx,
              ) => (
                <SwiperSlide key={idx}>
                  <KeynoteSpeaker
                    name={name}
                    subtitle={subtitle}
                    description={description}
                    imageLink={fileName}
                    githubLink={githubLink}
                    linkedinLink={linkedinLink}
                    websiteLink={websiteLink}
                  />
                </SwiperSlide>
              ),
            )}
          </Swiper>
        </div>
      </section>
    )
  );
}
