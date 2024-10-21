import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const SlingshotSimulation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Constraint,
      Mouse,
      MouseConstraint,
      Composites,
      Events,
    } = Matter;

    // Create an engine
    const engine = Engine.create();
    const world = engine.world;

    // Create a renderer
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: 500, // Make the slingshot smaller
        height: 400,
        wireframes: false,
        background: 'transparent',
      },
    });

    // Create a runner
    const runner = Runner.create();

    // Add ground and static objects
    const ground = Bodies.rectangle(250, 400, 500, 50, {
      isStatic: true,
      render: { fillStyle: '#888' },
    });
    const rockOptions = { density: 0.004, render: { fillStyle: '#999' } };
    let rock = Bodies.polygon(170, 300, 8, 20, rockOptions);
    const elastic = Constraint.create({
      pointA: { x: 170, y: 300 },
      bodyB: rock,
      stiffness: 0.05,
      render: {
        strokeStyle: '#FFFFFF',
        lineWidth: 2,
      },
    });

    const pyramid = Composites.pyramid(350, 200, 5, 5, 0, 0, (x, y) => {
      return Bodies.rectangle(x, y, 25, 40, { render: { fillStyle: '#FFF' } });
    });

    Composite.add(world, [ground, elastic, rock, pyramid]);

    // Mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    Composite.add(world, mouseConstraint);

    // Event to release and reset the rock
    Events.on(engine, 'afterUpdate', () => {
      if (mouseConstraint.mouse.button === -1 && (rock.position.x > 190 || rock.position.y < 230)) {
        rock = Bodies.polygon(170, 300, 8, 20, rockOptions);
        Composite.add(world, rock);
        elastic.bodyB = rock;
      }
    });

    // Run the engine and renderer
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '500px', height: '400px', margin: '0 auto' }} /> // Center and reduce size
  );
};

export default SlingshotSimulation;
