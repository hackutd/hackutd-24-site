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
