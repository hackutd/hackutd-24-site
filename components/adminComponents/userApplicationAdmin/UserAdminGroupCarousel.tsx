import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';
import UserAdminView from './UserAdminView';

interface UserAdminGroupCarouselProps {
  group: UserIdentifier[];
}

export default function UserAdminGroupCarousel({ group }: UserAdminGroupCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  return (
    <div className="h-full flex w-full p-3">
      <button className="embla__prev" onClick={scrollPrev}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <div className="overflow-x-hidden w-full">
        <div ref={emblaRef}>
          <div className="flex">
            {group.map((member) => (
              <div key={member.id} className="min-w-0 shrink-0 grow-0 basis-full pl-4">
                <UserAdminView currentApplicant={member} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <button className="embla__next" onClick={scrollNext}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
