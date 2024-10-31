import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import UserAdminView from './UserAdminView';
import { RequestHelper } from '@/lib/request-helper';
import { useAuthContext } from '@/lib/user/AuthContext';

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
  const [notes, setNotes] = useState(group.map((_) => ''));
  useEffect(() => {
    setNotes(group.map((_) => ''));
  }, [group]);
  const { user } = useAuthContext();
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
            {group.map((member, idx) => (
              <div key={member.id} className="min-w-0 shrink-0 grow-0 basis-full pl-4">
                <UserAdminView
                  onNoteUpdate={(newNote) => {
                    setNotes((prev) =>
                      prev.map((note, noteIndex) => (noteIndex === idx ? newNote : note)),
                    );
                  }}
                  currentApplicant={member}
                  currentNote={notes[idx]}
                  onScoreSubmit={async (groupScore) => {
                    try {
                      const { data } = await RequestHelper.post<
                        {
                          scores: Array<{
                            adminId: string;
                            hackerId: string;
                            score: number;
                            note: string;
                          }>;
                        },
                        { msg: string }
                      >(
                        '/api/scoring',
                        {
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: user.token,
                          },
                        },
                        {
                          scores: group.map((member, idx) => ({
                            adminId: user.id,
                            hackerId: member.id,
                            score: groupScore,
                            note: notes[idx],
                          })),
                        },
                      );
                      alert(data.msg);
                    } catch (err) {
                      alert('Error submitting score. Please try again later...');
                      console.error(err);
                    }
                  }}
                />
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
