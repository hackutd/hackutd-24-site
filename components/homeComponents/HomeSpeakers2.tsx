import SpeakerImage from '../../public/assets/Speaker.png';
import Image from 'next/image';

export default function HomeSpeakers() {
  return (
    <section className="overflow-x-auto min-h-[24rem] pb-20">
      <h1 className="text-5xl font-bold mb-3 text-center relative font-jua z-10 text-[#F7CE79] text-stroke">
        Keynote Speaker
      </h1>
      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-3 mx-auto justify-center">
        <Image
          className="md:w-[400px] md:h-[400px]"
          src={SpeakerImage}
          width={200}
          height={200}
          alt="Speaker"
        />
        <div className="w-4/5 bg-white rounded-3xl md:w-1/2 px-8 py-10 flex flex-col gap-y-2">
          <h1 className="font-fredoka font-medium text-[#F7CE79] text-4xl">Gen Fukunaga</h1>
          <h3 className="font-fredoka text-xl">Founder of Funimation</h3>
          <hr className="border-t-4 w-[60px] border-black my-2" />
          <p className="mt-3 leading-7 font-fredoka text-lg font-normal">
            Gen Fukunaga, a pioneering Japanese-American entrepreneur, founded Funimation and
            brought anime hits like Dragon Ball and My Hero Academia to North America, transforming
            the anime landscape. He stepped down as president and chairman in 2019, leaving a
            lasting legacy.
          </p>
        </div>
      </div>
    </section>
  );
}
