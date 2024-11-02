import { stats } from '../../lib/data';

export default function HomeVideoStats() {
  return (
    <section className="z-10 relative md:h-[370px]">
      <div className="flex flex-col justify-center items-center md:flex-row mx-auto py-[3rem]">
        {/* Video */}
        {/* !change */}
        <div className="w-full aspect-video flex justify-center">
          <iframe
            className="w-7/8 md:w-[800px] md:h-[450px]"
            src="https://www.youtube.com/embed/dMVtL2OmB60?si=ZKpc1VRAM6i-XmQQ"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Stats */}
        {/* <div>
          {stats.map((stat, index) => (
            <div
              key={stat.data}
              className={`${
                index % 2 === 0 ? 'lg:ml-40 md:ml-20 ml-14' : 'md:mr-8 mr-24'
              } text-center md:my-6 my-4`}
            >
              <p className="font-bold text-2xl text-primaryDark lg:text-5xl">{stat.data}</p>
              <p className="font-medium text-lg lg:text-3xl">{stat.object}</p>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
