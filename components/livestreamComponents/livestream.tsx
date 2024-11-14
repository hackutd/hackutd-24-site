import React from 'react';

const Livestream = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="relative w-[90%] max-w-7xl">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/60 shadow-lg">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>

      <style jsx global>{`
        body,
        html {
          background-image: url('/assets/lsHero.png');
          background-size: cover;
          background-position: center;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

export default Livestream;
