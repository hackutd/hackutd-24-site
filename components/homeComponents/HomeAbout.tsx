import React from 'react';
import { CSSProperties } from 'react';

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

  const styles: { [key: string]: CSSProperties } = {
    container: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background:
        '#FFFFFF url("data:image/svg+xml,%3Csvg width%3D%22100vw%22 height%3D%22706px%22 viewBox%3D%220 0 100vw 706px%22 fill%3D%22none%22 xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cfilter id%3D%22blurStrong%22%3E%3CfeGaussianBlur stdDeviation%3D%2220%22/%3E%3C/filter%3E%3C/defs%3E%3Cellipse cx%3D%2295vw%22 cy%3D%2280px%22 rx%3D%22180px%22 ry%3D%22180px%22 fill%3D%22%234A3AFF%22 opacity%3D%220.1%22 filter%3D%22url(%23blurStrong)%22/%3E%3Cellipse cx%3D%2290vw%22 cy%3D%220px%22 rx%3D%22195px%22 ry%3D%22180px%22 fill%3D%22%23962DFF%22 opacity%3D%220.1%22 filter%3D%22url(%23blurStrong)%22/%3E%3Cellipse cx%3D%2210vw%22 cy%3D%22606px%22 rx%3D%22130px%22 ry%3D%22130px%22 fill%3D%22%234A3AFF%22 opacity%3D%220.1%22 filter%3D%22url(%23blurStrong)%22/%3E%3Cellipse cx%3D%225vw%22 cy%3D%22556px%22 rx%3D%22110px%22 ry%3D%22110px%22 fill%3D%22%23962DFF%22 opacity%3D%220.1%22 filter%3D%22url(%23blurStrong)%22/%3E%3Cellipse cx%3D%220vw%22 cy%3D%22506px%22 rx%3D%2290px%22 ry%3D%2290px%22 fill%3D%22%232D5BFF%22 opacity%3D%220.1%22 filter%3D%22url(%23blurStrong)%22/%3E%3C/svg%3E") no-repeat top right',
      color: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      width: '100vw',
      height: '120vh',
      overflow: 'hidden',
      paddingTop: '2vh',
    },
    header: {
      fontFamily: 'Fredoka, sans-serif',
      fontWeight: 600,
      fontSize: 'calc(24px + 2vw)',
      color: '#05149C',
      padding: '1vh 0',
    },
    description: {
      fontFamily: 'DM Sans, sans-serif',
      fontWeight: 400,
      fontSize: '16px',
      color: '#000000',
      width: '90%',
      margin: '1vh 0',
    },
    statsContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
      fontFamily: 'DM Sans, sans-serif',
      fontWeight: 400,
      fontSize: '30px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginTop: '2vh',
    },
    statsItem: {
      width: '45%',
      margin: '2% 0',
      position: 'relative',
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @media (max-width: 600px) {
            .container {
              height: 400vh !important;
            }
            .statsContainer {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .customShapeOne {
              width: 50% !important;
              height: 85px !important;
              left: 45% !important;
            }
            .customShapeTwo {
              width: 90% !important;
              top: 110px !important;
              height: 110px !important;
              left: 5% !important;
            }
            .customShapeThree {
              width: 90% !important;
              top: 235px !important;
              height: 275px !important;
              left: 5% !important;
            }
            .customShapeFour {
              width: 40% !important;
              height: 85px !important;
              left: 5% !important;
            }
          }
        `}
      </style>
      <h1 className="header" style={styles.header}>
        About HackPortal
      </h1>
      <p className="description" style={styles.description}>
        Hackathons are 24-hour gatherings where students collaborate <br /> to create innovative
        projects, forge new connections, and compete for prizes.
      </p>
      <div className="statsContainer" style={styles.statsContainer}>
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
