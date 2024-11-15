import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const SlingshotSimulation = () => {
  const containerRef = useRef(null);
  const [isRockDragging, setIsRockDragging] = useState(false);
  const engineRef = useRef(null);

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
      Events,
      Vector,
    } = Matter;

    const engine = Engine.create({ gravity: { x: 0, y: 1.2 } });
    engineRef.current = engine;
    const world = engine.world;

    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: 1500,
        height: 700,
        wireframes: false,
        background: 'transparent',
      },
    });

    const runner = Runner.create();

    const slingshotX = 200;
    const slingshotY = 500;

    const rockOptions = {
      density: 0.008,
      friction: 0.01,
      restitution: 0.6,
      render: {
        sprite: {
          texture: 'assets/mascotThrow.png',
          xScale: 0.2,
          yScale: 0.2,
        },
      },
    };

    const createRock = () => Bodies.circle(slingshotX, slingshotY, 20, rockOptions);

    let rock = createRock();

    const elastic = Constraint.create({
      pointA: { x: slingshotX, y: slingshotY },
      bodyB: rock,
      stiffness: 0.05,
      damping: 0.01,
      length: 10,
      render: {
        strokeStyle: '#FFFFFF',
        lineWidth: 3,
        type: 'spring',
      },
    });

    const boatPlatform = Bodies.rectangle(1200, 550, 400, 20, {
      isStatic: true,
      render: {
        sprite: {
          texture: 'assets/boat.png',
          xScale: 0.5,
          yScale: 0.5,
        },
      },
    });

    const boatTopSurface = Bodies.rectangle(1200, 520, 350, 10, {
      isStatic: true,
      render: { visible: false },
    });

    const blockWidth = 50;
    const blockHeight = 20;
    const startX = 1200;
    const startY = 480;
    const rows = 5;
    const pyramid = [];

    for (let row = 0; row < rows; row++) {
      const blocksInRow = rows - row;
      const rowY = startY - row * (blockHeight + 5);

      for (let i = 0; i < blocksInRow; i++) {
        const xOffset = (blockWidth + 5) * (i - (blocksInRow - 1) / 2);
        const x = startX + xOffset;

        const texture = row % 2 === 0 ? 'assets/horizontal.png' : 'assets/vertical.png';
        const block = Bodies.rectangle(x, rowY, blockWidth, blockHeight, {
          density: 0.003,
          friction: 0.6,
          restitution: 0.2,
          render: {
            sprite: {
              texture: texture,
              xScale: 0.5,
              yScale: 0.5,
            },
          },
        });
        pyramid.push(block);
      }
    }

    const createEnemy = (x, y, texture) =>
      Bodies.circle(x, y, 0.5, {
        isStatic: false,
        density: 0.005,
        friction: 0.6,
        restitution: 0.5,
        render: {
          sprite: {
            texture: texture,
            xScale: 0.1,
            yScale: 0.1,
          },
        },
      });

    const enemies = [
      createEnemy(startX - 125, startY - 30, 'assets/ab-capybara.png'),
      createEnemy(startX + 125, startY - 60, 'assets/ab-doggo.png'),
      createEnemy(startX, startY - 130, 'assets/ab-sprout.png'),
    ];

    Composite.add(world, [boatPlatform, boatTopSurface, elastic, rock, ...pyramid, ...enemies]);

    const addFloatingAnimation = (enemy) => {
      let direction = 1;
      setInterval(() => {
        Matter.Body.translate(enemy, { x: 0, y: direction * 0.5 });
        direction *= -1;
      }, 1000);
    };

    enemies.forEach(addFloatingAnimation);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Events.on(mouseConstraint, 'startdrag', (event) => {
      if (event.body === rock) {
        setIsRockDragging(true);
      }
    });

    Events.on(mouseConstraint, 'enddrag', (event) => {
      if (event.body === rock) {
        setIsRockDragging(false);

        const velocity = Vector.sub(
          { x: slingshotX, y: slingshotY },
          { x: rock.position.x, y: rock.position.y },
        );

        const powerMultiplier = 0.15;

        setTimeout(() => {
          elastic.bodyB = null;
          Matter.Body.setVelocity(rock, {
            x: velocity.x * powerMultiplier,
            y: velocity.y * powerMultiplier,
          });

          Matter.Body.setAngularVelocity(rock, (velocity.x > 0 ? 1 : -1) * 0.2);

          setTimeout(() => {
            const newRock = createRock();
            Composite.add(world, newRock);
            elastic.bodyB = newRock;
            rock = newRock;
          }, 200);
        }, 20);
      }
    });

    Composite.add(world, mouseConstraint);

    render.options.hasBounds = true;
    Matter.Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 1500, y: 700 },
    });

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
    <div
      ref={containerRef}
      style={{
        width: '100rem',
        height: '50rem',
        margin: '0 auto',
        cursor: isRockDragging ? 'grabbing' : 'grab',
      }}
    />
  );
};

export default SlingshotSimulation;
