import * as React from 'react';
import { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Image from 'next/image';

import corgiOnBoat from '../../public/assets/corgi_on_boat.png';
import styles from './HomeSchedule.module.css';

// import rightLilypad from '../../public/assets/right_lilypads.png';
import topLilypad from '../../public/assets/top_lilypads.png';
// import leftLilypad from '../../public/assets/left_lilypads.png';
import ducks from '../../public/assets/ducks-moving.gif';

import BoulderLeft from 'public/assets/boulderLeft.png';
import BoulderRight from 'public/assets/boulderRight.png';
import { SectionReferenceContext } from '@/lib/context/section';

/* Calendar */
export default function HomeSchedule(props: { scheduleCard: ScheduleEvent[]; dateCard: Dates }) {
  /* Event Colors */
  const { scheduleRef } = React.useContext(SectionReferenceContext);
  const eventColors = {
    All: 'border-gray-500 text-gray-500 bg-white',
    Required: 'border-[#EF6C8B] text-[#EF6C8B] bg-white',
    Meal: 'border-[#2CB716] text-[#2CB716] bg-white',
    Social: 'border-[#FFB900] text-[#FFB900] bg-white',
    Sponsor: 'border-[#7579E1] text-[#7579E1] bg-white',
    Workshop: 'border-[#22B9C5] text-[#22B9C5] bg-white',
    'All-Filter': 'border-gray-500 bg-gray-500 text-white',
    'Required-Filter': 'border-[#EF6C8B] bg-[#EF6C8B] text-white',
    'Meal-Filter': 'border-[#2CB716] bg-[#2CB716] text-white',
    'Social-Filter': 'border-[#FFB900] bg-[#FFB900] text-white',
    'Sponsor-Filter': 'border-[#7579E1] bg-[#7579E1] text-white',
    'Workshop-Filter': 'border-[#22B9C5] bg-[#22B9C5] text-white',
  };

  /* Dates Values */
  const dateValues = {
    year: props.dateCard[0].year,
    day1: props.dateCard[0].day1,
    day1Month: props.dateCard[0].day1Month,
    day2: props.dateCard[0].day2,
    day2Month: props.dateCard[0].day2Month,
    endTime: props.dateCard[0].endTime,
    startTime: props.dateCard[0].startTime,
  };

  /* Set event dates and times */
  const day1StartDateAndTime = new Date(
    dateValues['year'],
    dateValues['day1Month'],
    dateValues['day1'],
    dateValues['startTime'],
    0,
  );
  const day2StartDateAndTime = new Date(
    dateValues['year'],
    dateValues['day2Month'],
    dateValues['day2'],
    dateValues['startTime'],
    0,
  );
  const eventEndDateAndTime = new Date(
    dateValues['year'],
    dateValues['day1Month'],
    dateValues['day2'] + 1,
    dateValues['endTime'],
    0,
  );
  /* Filter Functionality */
  const [filter, setFilter] = useState('All');

  const changeFilter = (newFilter: string) => {
    if (newFilter === filter) {
      setFilter('All');
    } else {
      setFilter(newFilter);
    }
  };

  /* Event Component */
  const Event = ({ data, index, arrayLength }) => {
    const startDate = new Date(data.startDate);
    const formattedTime = startDate
      .toLocaleString([], { hour: 'numeric', minute: 'numeric' })
      .replace(' ', '')
      .replace('AM', 'am')
      .replace('PM', 'pm');

    const showEvent = filter === 'All' || filter === data.type;
    const showFilteredEvents = filter !== 'All';

    const isLastEvent = index === arrayLength - 1;
    const hasEvenIndex = index % 2 === 0;

    return (
      showEvent && (
        <>
          <div className="border-b border-[#4D8889] p-2">
            <div className="flex justify-between pb-1">
              <div className="text-md font-bold font-dmSans">{formattedTime}</div>
              <div className="text-md font-bold font-dmSans">{data.title}</div>
            </div>
            <div className="flex justify-between">
              <div
                className={`font-bold font-poppins bg-white text-xs rounded-xl py-1 px-2 border-2 ${
                  eventColors[data.type]
                }`}
              >
                {data.type}
              </div>
              <div className="text-gray-600 flex items-center font-dmSans">
                <LocationOnIcon style={{ fontSize: 'large', marginRight: '2px' }} />
                {data.location}
              </div>
            </div>
          </div>
        </>
      )
    );
  };

  /* Filter Daily Events */
  const getDailyEvents = (startTime, endTime) => {
    return props.scheduleCard
      .sort((a, b) => {
        return +new Date(a.startDate) - +new Date(b.startDate);
      })
      .filter((event) => {
        const eventDate = new Date(event.startDate);
        return eventDate >= startTime && eventDate <= endTime;
      })
      .map((event, index, array) => (
        <Event data={event} key={event.title + index} index={index} arrayLength={array.length} />
      ));
  };

  const day1Events = getDailyEvents(day1StartDateAndTime, day2StartDateAndTime);
  const day2Events = getDailyEvents(day2StartDateAndTime, eventEndDateAndTime);

  return (
    <div className={`${styles.container} pt-[8rem] relative`}>
      <BackgroundAssets />
      <div ref={scheduleRef} id="schedule-section" className={styles.content}>
        <div
          style={{ textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)' }}
          className="text-center text-2xl font-bold text-white p-2 font-montserrat uppercase relative"
        >
          Schedule
        </div>
        <div
          style={{ textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)' }}
          className="text-center text-4xl font-bold text-[#F7CE79] p-2 font-fredoka uppercase relative"
        >
          What can you expect?
        </div>
        {/* Filter */}
        <div className="flex justify-center relative">
          <div
            style={{ width: 'fit-content' }}
            className="md:flex justify-center items-center bg-white bg-opacity-60 px-12 py-2 rounded-3xl shadow-default"
          >
            <div
              onClick={() => changeFilter('All')}
              className={`text-sm font-bold font-poppins cursor-pointer px-2 h-8 py-1 border-2 rounded-xl 
              ${filter === 'All' ? eventColors['All-Filter'] : eventColors['All']}`}
            >
              All
            </div>

            <div
              onClick={() => changeFilter('Required')}
              className={`text-sm font-bold font-poppins cursor-pointer mx-1 px-2 h-8 py-1 border-2 rounded-xl 
              ${filter === 'Required' ? eventColors['Required-Filter'] : eventColors['Required']}`}
            >
              Required
            </div>

            <div
              onClick={() => changeFilter('Sponsor')}
              className={`text-sm font-bold font-poppins cursor-pointer mx-1 px-2 h-8 py-1 border-2 rounded-xl 
              ${filter === 'Sponsor' ? eventColors['Sponsor-Filter'] : eventColors['Sponsor']}`}
            >
              Sponsor
            </div>

            <div
              onClick={() => changeFilter('Meal')}
              className={`text-sm font-bold font-poppins cursor-pointer mx-1 px-2 h-8 py-1 border-2 rounded-xl 
              ${filter === 'Meal' ? eventColors['Meal-Filter'] : eventColors['Meal']}`}
            >
              Meal
            </div>

            <div
              onClick={() => changeFilter('Workshop')}
              className={`text-sm font-bold font-poppins cursor-pointer mx-1 px-2 h-8 py-1 border-2 rounded-xl 
              ${filter === 'Workshop' ? eventColors['Workshop-Filter'] : eventColors['Workshop']}`}
            >
              Workshop
            </div>

            <div
              onClick={() => changeFilter('Social')}
              className={`text-sm font-bold font-poppins cursor-pointer mx-1 px-2 h-8 py-1 border-2 rounded-xl 
              ${filter === 'Social' ? eventColors['Social-Filter'] : eventColors['Social']}`}
            >
              Social
            </div>
          </div>
        </div>

        {/* Calendar */}
        {/* TODO: enable this when have schedule data */}
        <div className="md:flex p-1 overflow-y-auto overflow-x-hidden mx-auto lg:w-[80%] w-full h-full">
          <div className="w-full lg:w-1/2 px-4 md:px-0 relative">
            <div
              style={{ textShadow: '0 4px 4px rgb(0,0,0,0.25)' }}
              className="text-3xl font-black py-6 text-[#F7CE79] font-fredoka"
            >
              Day 1: Saturday
            </div>
            <div className="bg-white mb-8 mx-2 p-2 border-2 rounded-3xl border-[#05149C] border-opacity-20">
              {day1Events}
            </div>
          </div>

          <div className="w-full lg:w-1/2 md:ml-6 px-4 md:px-0 relative">
            <div
              style={{ textShadow: '0 4px 4px rgb(0,0,0,0.25)' }}
              className="text-3xl font-black py-6 text-[#F7CE79] font-fredoka"
            >
              Day 2: Sunday
            </div>
            <div className="bg-white mb-8 mx-2 p-2 border-2 rounded-3xl border-[#05149C] border-opacity-20">
              {day2Events}
            </div>
          </div>
        </div>
        <div className="flex justify-center px-[2rem]">
          {/* Ducks moving left to right */}
          <div className={styles.duckAnimation}>
            <Image width={600} height={300} src={ducks.src} alt="ducks.png" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Background Assets */
/* Background Assets */
const BackgroundAssets = () => {
  return (
    <>
      {/* Boulder Left */}
      <Image
        src={BoulderLeft.src}
        className="absolute w-[80vh] h-auto top-[-9.5vh] md:top-[-13.5vh] z-[2] left-0"
        alt="Boulder Left"
        width={500}
        height={500}
      />

      {/* Boulder Right */}
      <Image
        src={BoulderRight.src}
        className="absolute w-[80vh] h-auto top-[-9.5vh] md:top-[-13.5vh] z-[2] right-0"
        alt="Boulder Right"
        width={500}
        height={500}
      />

      <div
        className="image-container"
        style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
      >
        <Image
          width={350}
          height={350}
          src={corgiOnBoat.src}
          className={styles.mascot}
          alt="corgi_on_boat.png"
          style={{ position: 'relative', top: '-200px', zIndex: 3 }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '50vh',
        }}
      >
        <Image
          width={1300}
          height={1000}
          src={topLilypad.src}
          alt="top_lilypads.png"
          style={{
            position: 'relative',
            top: '-80%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </>
  );
};
