import * as React from 'react';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomChar() {
  const rand = getRandomInt(0, 60);
  return String.fromCharCode(rand + 65);
}

type TextScrambleProps = {
  text: string;
  play?: boolean;
  speed?: number;
  seed?: number;
  seedInterval?: number;
  step?: number;
  stepInterval?: number;
  scramble?: number;
  onComplete?: Function;
};

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  play = true,
  speed = 0.4,
  seed = 3,
  seedInterval = 10,
  step = 1,
  stepInterval = 1,
  scramble = 8,
  onComplete,
  ...rest
}: TextScrambleProps) => {
  // animation frame request
  const requestRef = React.useRef<number>(0);

  // time elapsed
  const elapsedRef = React.useRef(0);
  const fpsInterval = 1000 / (60 * speed);

  // scramble tick
  const tickRef = React.useRef<number>(0);

  // current characted index ref
  const idxRef = React.useRef<number>(0);

  // scramble controller
  const scrambleRef = React.useRef<number[]>([]);

  // text node ref
  const textRef = React.useRef<HTMLSpanElement>(null);

  const seedRandomCharacters = () => {
    for (var i = 0; i < seed; i++) {
      const pos = getRandomInt(idxRef.current, text.length);
      scrambleRef.current[pos] = scrambleRef.current[pos] || 0;
    }
  };

  const moveCharIndex = () => {
    for (var i = 0; i < step; i++) {
      const currentIndex = idxRef.current;
      scrambleRef.current[currentIndex] =
        scrambleRef.current[currentIndex] || 0;
      idxRef.current += 1;
    }
  };

  const animate = (time: number) => {
    const timeElapsed = time - elapsedRef.current;

    requestRef.current = requestAnimationFrame(animate);

    if (timeElapsed > fpsInterval) {
      // timeRef.current = time - (timeElapsed % fpsInterval);
      elapsedRef.current = time;
      draw();
    }
  };

  const draw = () => {
    if (!textRef.current) return;

    if (tickRef.current % seedInterval === 0) {
      seedRandomCharacters();
    }

    if (tickRef.current % stepInterval === 0) {
      moveCharIndex();
    }

    let newString = '';
    let charsDone = 0;

    for (var i = 0; i < text.length; i++) {
      const cPos = scrambleRef.current[i];

      switch (true) {
        case text[i] === ' ':
          newString += ' ';
          charsDone++;
          break;
        case cPos >= scramble:
          newString += text[i];
          charsDone++;
          break;
        case cPos < scramble && i <= idxRef.current:
          newString += getRandomChar();
          scrambleRef.current[i] += 1;
          break;
        case cPos < scramble:
          newString += getRandomChar();
          break;
        default:
          newString += '<span>&nbsp;</span>';
      }
    }

    textRef.current.innerHTML = newString;

    if (charsDone === text.length) {
      cancelAnimationFrame(requestRef.current);
      if (onComplete) {
        onComplete();
      }
      return;
    }

    tickRef.current += 1;
  };

  React.useEffect(() => {
    tickRef.current = 0;
    idxRef.current = 0;
    scrambleRef.current = new Array(text.length);
  }, [text]);

  React.useEffect(() => {
    if (play) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [animate, play]); // Make sure the effect runs only once

  return <span ref={textRef} {...rest} />;
};
