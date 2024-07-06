import { Engine, tsParticles } from '@tsparticles/engine';
import Particles from './Particles';

/*
  NOTE:
  - These files within Particles folder is copied manually from @tsparticles/react package
  - Because the package itself depends on react v18, while when I worked on this, our HackPortal has react v17 and many conflicts that prevent updating to react v18 right away
*/

export type { IParticlesProps } from './IParticlesProps';

export async function initParticlesEngine(cb: (engine: Engine) => Promise<void>): Promise<void> {
  await cb(tsParticles);
}

export default Particles;
export { Particles };
