import QRCodeStyling, { Options } from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';

export interface QRCodeProps {
  data: string;
  width: number;
  height: number;
  group: string;
}

const IMAGE_GROUP_MAPPING = {
  Duck: '/assets/ab-duck.png',
  Capybara: '/assets/ab-capybara.png',
  Frog: '/assets/ab-frog.png',
  Corgi: '/assets/ab-doggo.png',
};

const COLOR_GROUP_MAPPING = {
  Corgi: '#E7A65D',
  Duck: '#000000',
  Capybara: '#C59E7D',
  Frog: '#000000',
};

export default function QRCode({ data, width, height, group }: QRCodeProps) {
  const [options, setOptions] = useState<Options>({
    width,
    height,
    type: 'svg',
    data,
    image: IMAGE_GROUP_MAPPING[group],
    margin: 10,
    dotsOptions: {
      color: COLOR_GROUP_MAPPING[group],
    },
    imageOptions: {
      hideBackgroundDots: true,
    },
  });
  const [qrCode, setQrCode] = useState<QRCodeStyling>();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setQrCode(new QRCodeStyling(options));
  }, []);

  useEffect(() => {
    if (ref.current) {
      qrCode?.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode?.update(options);
  }, [qrCode, options]);

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      data,
    }));
  }, [qrCode, data]);

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      image: IMAGE_GROUP_MAPPING[group],
      dotsOptions: {
        color: COLOR_GROUP_MAPPING[group],
      },
    }));
  }, [qrCode, group]);

  return <div ref={ref} />;
}
