import clsx from 'clsx';
import Image from 'next/image';
import lsHero from 'public/assets/lsHero.png';

const Livestream = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <Image
        src={lsHero.src}
        height={lsHero.height}
        width={lsHero.width}
        alt="lsHero.png"
        className="absolute top-0 left-0 w-full h-full z-0"
      />

      <div className={clsx('relative z-[1]', 'w-[90%] max-w-7xl')}>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/60 shadow-lg">
          <iframe
            style={{ width: '100%', height: '100%' }}
            src="https://www.youtube.com/embed/F69Z7QsK_tE?si=wzggWIsO-kX-7HH_"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Livestream;
