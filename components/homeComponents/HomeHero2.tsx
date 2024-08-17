import Image from 'next/image';
import MLH_Sticker from '../../public/assets/mlh-sticker.png';
import BackgroundCircles from '../BackgroundCircles';

export default function HomeHero() {
  return (
    <section className="min-h-screen bg-contain bg-white flex flex-col-reverse md:flex-col">
      <div className="flex h-screen w-full relative">
        <div className="w-full h-full absolute top-0 left-0 z-0">
          <BackgroundCircles />
        </div>

        <div className="relative z-10 shrink-0 w-full flex">
          {/* MLH sticker */}
          <div className="absolute top-0 right-4 z-20">
            <Image
              src={MLH_Sticker.src}
              height={MLH_Sticker.height}
              width={MLH_Sticker.width}
              alt="MLH sticker"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Big welcome */}
          <div className="w-full flex flex-col gap-2 justify-center items-center bg-[rgba(255,255,255,0.75)] backdrop-blur-[60px]">
            <p className="font-nunito text-[#262626] text-xl md:text-3xl">Welcome To</p>
            <h1 className="font-fredokaOne text-4xl md:text-6xl lg:text-8xl font-bold text-[#05149C]">
              HACKPORTAL
            </h1>
          </div>
        </div>
      </div>

      {/* Bottom banner */}
      <div className="font-dmSans w-full flex justify-center bg-[#7B81FF] text-white h-[1.75rem] text-nowrap overflow-hidden">
        <p className="text-lg">
          SAMPLE TEXT • SAMPLE TEXT • SAMPLE TEXT • SAMPLE TEXT • SAMPLE TEXT • SAMPLE TEXT • SAMPLE
          TEXT • SAMPLE TEXT • SAMPLE TEXT
        </p>
      </div>
    </section>
  );
}
