import { stats } from '../../lib/data';

export default function HomeVideoStats() {
  return (
    <section className="z-0 relative min-h-[75vh] pt-64">
      <div className="flex flex-col justify-center items-center md:flex-row">
        {/* Video */}
        <iframe
          className="video border-0"
          width="700"
          height="400"
          src="https://www.youtube.com/embed/dMVtL2OmB60?si=vtVfrkEuXpf5g5Vr"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}
