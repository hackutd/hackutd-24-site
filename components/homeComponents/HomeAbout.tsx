import React from 'react';
import { CSSProperties } from 'react';
import styles from './HomeAbout.module.css';
import Image from 'next/image';

const HomeAbout = () => {
  interface CustomShapesStyles {
    [key: string]: CSSProperties;
  }

  const customShapesStyles: CustomShapesStyles = {
    customShapeOne: {
      position: 'absolute',
      top: '13px',
      left: '27.5%',
      width: '30%',
      height: '130px',
      background: '#C1C8FF',
      borderRadius: '0px 0px 0px 158px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#000',
      transition: 'transform 400ms',
      cursor: 'pointer',
    },
    labelBoxOne: {
      fontWeight: 500,
      fontSize: 'calc(10px + 2vw)',
      fontFamily: 'Fredoka',
      color: '#05149C',
      marginBottom: '-10px',
    },
    customShapeTwo: {
      position: 'absolute',
      top: '160px',
      left: '12.5%',
      width: '45%',
      height: '200px',
      background: '#C1C8FF',
      borderRadius: '0px 158px 0px 158px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#000',
      transition: 'transform 400ms',
      cursor: 'pointer',
    },
    labelBoxTwo: {
      fontWeight: 500,
      fontSize: 'calc(10px + 2vw)',
      fontFamily: 'Fredoka',
      color: '#05149C',
      marginBottom: '-10px',
    },
    customShapeThree: {
      position: 'absolute',
      top: '13px',
      right: '10%',
      width: '30%',
      height: '347px',
      background: '#C1C8FF',
      borderRadius: '0 158px 0 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#000',
      transition: 'transform 400ms',
      cursor: 'pointer',
    },
    labelBoxThree: {
      fontWeight: 500,
      fontSize: 'calc(10px + 2vw)',
      fontFamily: 'Fredoka',
      color: '#05149C',
      marginBottom: '-10px',
    },
    customShapeFour: {
      position: 'absolute',
      top: '13px',
      left: '12.5%',
      width: '15%',
      height: '130px',
      background: '#C1C8FF',
      borderRadius: '0 158px 0 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#000',
      transition: 'transform 400ms',
      cursor: 'pointer',
      flexDirection: 'column',
    },
    statisticText: {
      fontSize: 'calc(16px + 0.25vw)',
      color: '#000',
      fontFamily: 'DM Sans',
    },
  };

  return (
    <div className={styles.container}>
      {/* <div
        className={styles.sky}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        width: '100%',
          height: '2400px',
          background: 'linear-gradient(to bottom, #3398D1 30%, #8BD1F0, #C6E9F4)',
          zIndex: 0,
        }}
      /> */}
      <h1 className={styles.header}>About HackPortal</h1>
      <p className={styles.description}>
        Hackathons are 24-hour gatherings where students collaborate <br /> to create innovative
        projects, forge new connections, and compete for prizes.
      </p>
      <div className={styles.statsContainer}>
        <div className="statsItem">
          <div
            className="customShape customShapeFour"
            style={{ ...customShapesStyles.customShapeFour }}
          ></div>
        </div>
        <div className="statsItem">
          <div
            className="customShape customShapeOne"
            style={{ ...customShapesStyles.customShapeOne }}
          >
            <div style={customShapesStyles.labelBoxOne}>Incredible</div>
            <div style={customShapesStyles.statisticText}>Statistic 1</div>
          </div>
        </div>
        <div className="statsItem">
          <div
            className="customShape customShapeTwo"
            style={{ ...customShapesStyles.customShapeTwo }}
          >
            <div style={customShapesStyles.labelBoxTwo}>Shocking</div>
            <div style={customShapesStyles.statisticText}>Statistic 2</div>
          </div>
        </div>
        <div className="statsItem">
          <div
            className="customShape customShapeThree"
            style={{ ...customShapesStyles.customShapeThree }}
          >
            <div style={customShapesStyles.labelBoxThree}>Big</div>
            <div style={customShapesStyles.statisticText}>Statistic 3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAbout;
