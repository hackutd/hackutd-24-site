import * as React from 'react';
import { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Image from 'next/image';

import corgiOnBoat from '../../public/assets/corgi_on_boat.png';
import styles from './HomeSchedule.module.css';

// import rightLilypad from '../../public/assets/right_lilypads.png';
import topLilypad from '../../public/assets/top_lilypads.png';
// import leftLilypad from '../../public/assets/left_lilypads.png';
import ducks from '../../public/assets/ducks.png';

import BoulderLeft from '../assets/BoulderLeft';
import BoulderRight from '../assets/BoulderRight';

/* Calendar */
export default function HomeSchedule(props: { scheduleCard: ScheduleEvent[]; dateCard: Dates }) {
  /* Event Colors */
  const eventColors = {
    All: 'border-gray-500 text-gray-500',
    Required: 'border-[#FC012E] text-[#FC012E]',
    Food: 'border-[#56E100] text-[#56E100]',
    Social: 'border-[#FFB900] text-[#FFB900]',
    Sponsor: 'border-[#008CF1] text-[#008CF1]',
    Workshop: 'border-[#5200FF] text-[#5200FF]',
    'All-Filter': 'border-gray-500 bg-gray-500 text-white',
    'Required-Filter': 'border-[#FC012E] bg-[#FC012E] text-white',
    'Food-Filter': 'border-[#56E100] bg-[#56E100] text-white',
    'Social-Filter': 'border-[#FFB900] bg-[#FFB900] text-white',
    'Sponsor-Filter': 'border-[#008CF1] bg-[#008CF1] text-white',
    'Workshop-Filter': 'border-[#5200FF] bg-[#5200FF] text-white',
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
          <div className="border-b border-[#4D8889] p-4">
            <div className="flex justify-between pb-1">
              <div className="text-md font-bold font-dmSans">{formattedTime}</div>
              <div className="text-md font-bold font-dmSans">{data.title}</div>
            </div>
            <div className="flex justify-between">
              <div
                className={`bg-white text-xs rounded-xl py-1 px-2 border-2 font-dmSans ${
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
    <div className={`${styles.container} pt-[10rem] relative`} id="schedule-section">
      <BackgroundAssets />
      <div className={styles.content}>
        <div
          style={{ textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)' }}
          className="text-center text-2xl font-bold text-white p-4 font-montserrat uppercase relative"
        >
          Schedule
        </div>
        <div
          style={{ textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)' }}
          className="text-center text-5xl font-bold text-[#F7CE79] p-4 font-fredoka uppercase relative"
        >
          What can you expect?
        </div>
        {/* Filter */}
        <div className="flex justify-center relative">
          <div
            style={{ width: 'fit-content' }}
            className="md:flex justify-center items-center bg-white bg-opacity-25 px-20 py-4 rounded-3xl shadow-default"
          >
            <div
              onClick={() => changeFilter('All')}
              className={`text-sm cursor-pointer px-2 h-8 py-1 border-2 rounded-xl border-gray-500
              ${filter === 'All' ? eventColors['All-Filter'] : eventColors['All']}`}
            >
              All
            </div>

            <div
              onClick={() => changeFilter('Required')}
              className={`text-sm cursor-pointer mx-1 px-2 h-8 py-1 border-2 rounded-xl bg-white
              ${filter === 'Required' ? eventColors['Required-Filter'] : eventColors['Required']}`}
            >
              Required
            </div>

            <div
              onClick={() => changeFilter('Sponsor')}
              className={`text-sm cursor-pointer mx-1 px-2 h-8 py-1 border-2 rounded-xl bg-white
              ${filter === 'Sponsor' ? eventColors['Sponsor-Filter'] : eventColors['Sponsor']}`}
            >
              Sponsor
            </div>

            <div
              onClick={() => changeFilter('Food')}
              className={`text-sm cursor-pointer	mx-1 px-2 h-8 py-1 border-2 rounded-xl bg-white
              ${filter === 'Food' ? eventColors['Food-Filter'] : eventColors['Food']}`}
            >
              Food
            </div>

            <div
              onClick={() => changeFilter('Workshop')}
              className={`text-sm cursor-pointer mx-1 px-2 h-8 py-1 border-2 rounded-xl bg-white
              ${filter === 'Workshop' ? eventColors['Workshop-Filter'] : eventColors['Workshop']}`}
            >
              Workshop
            </div>

            <div
              onClick={() => changeFilter('Social')}
              className={`text-sm cursor-pointer mx-1 px-2 h-8 py-1 border-2 rounded-xl bg-white
              ${filter === 'Social' ? eventColors['Social-Filter'] : eventColors['Social']}`}
            >
              Social
            </div>
          </div>
        </div>
        {/* Calendar */}
        <div className="md:flex p-1 overflow-y-auto overflow-x-hidden mx-auto lg:w-[80%] w-full h-full">
          <div className="w-full lg:w-1/2 px-4 md:px-0 relative">
            <div
              style={{ textShadow: '0 4px 4px rgb(0,0,0,0.25)' }}
              className="text-3xl font-black py-6 text-[#F7CE79] font-fredoka"
            >
              Day 1: Saturday
            </div>
            <div className="bg-white mb-8 mx-2 p-2 border-2 rounded-2xl border-[#05149C] border-opacity-20">
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
            <div className="bg-white mb-8 mx-2 p-2 border-2 rounded-2xl border-[#05149C] border-opacity-20">
              {day2Events}
            </div>
          </div>
        </div>
        <div className="flex justify-center px-[3rem]">
          {/* insert duck here */}
          <Image width={700} height={400} src={ducks.src} alt="ducks.png" />
        </div>
      </div>
    </div>
  );
}

const BackgroundAssets = () => {
  return (
    <>
      <BoulderLeft
        className={styles.boulderLeft}
        style={{
          width: '50%',
          position: 'absolute',
          zIndex: 2,
          left: '0',
          top: '-14px',
        }}
      />
      <BoulderRight
        className={styles.boulderRight}
        style={{
          width: '50%',
          position: 'absolute',
          right: '0',
          zIndex: 2,
          top: '-4px',
        }}
      />

      {/* TODO: make this dynamic */}
      {/* NOTE: remove this for now since it clutter the UI */}
      {/* <Image
        style={{
          position: 'absolute',
          top: '70%',
          right: '0',
          zIndex: 3,
        }}
        width={400}
        height={170}
        src={rightLilypad.src}
        alt="right_lilypads.png"
      /> */}

      {/* TODO: make this dynamic */}
      {/* NOTE: remove this for now since it clutter the UI */}
      {/* <Image
        style={{
          position: 'absolute',
          top: '30%',
          left: '0',
          zIndex: 3,
        }}
        width={300}
        height={170}
        src={leftLilypad.src}
        alt="left_lilypads.png"
      /> */}

      <Image
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
        }}
        width={1300}
        height={1000}
        className={styles.topLilypad}
        src={topLilypad.src}
        alt="top_lilypads.png"
      />

      <Image
        style={{
          position: 'absolute',
          top: '0',
          left: '45%',
          zIndex: 3,
        }}
        width={170}
        height={170}
        src={corgiOnBoat.src}
        className={styles.mascot}
        alt="corgi_on_boat.png"
      />
    </>
  );
};
