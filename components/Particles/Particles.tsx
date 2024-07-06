import { FC, useEffect } from 'react';
import type { IParticlesProps } from './IParticlesProps';
import { tsParticles, type Container } from '@tsparticles/engine';
import { loadRotateUpdater } from '@tsparticles/updater-rotate';

const Particles: FC<IParticlesProps> = (props) => {
  const id = props.id ?? 'tsparticles';

  useEffect(() => {
    let container: Container | undefined;

    loadRotateUpdater(tsParticles)
      .then(async () => {
        await tsParticles.load({ id, url: props.url, options: props.options }).then((c) => {
          container = c;
          props.particlesLoaded?.(c);
        });
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      container?.destroy();
    };
  }, [id, props, props.url, props.options]);

  return <div id={id} className={props.className}></div>;
};

export default Particles;
