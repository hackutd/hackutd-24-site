import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';

interface QRCodeReaderV2Props {
  onScanSuccess: (result: QrScanner.ScanResult) => void;
  onScanFail: (err: string | Error) => void;
}

export default function QRCodeReaderV2({ onScanSuccess, onScanFail }) {
  const scanner = useRef<QrScanner>();
  const videoElement = useRef<HTMLVideoElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  useEffect(() => {
    if (videoElement?.current && !scanner.current) {
      scanner.current = new QrScanner(videoElement?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: 'environment',
      });

      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      if (!videoElement?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        'Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.',
      );
  }, [qrOn]);

  return (
    <div className="w-[400px] h-[400px]">
      <video ref={videoElement}></video>
    </div>
  );
}
