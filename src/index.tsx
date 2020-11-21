import React, { useRef } from "react"

function getRandomInt(min:number, max:number) {
  return Math.floor(Math.random() * (max - min) + min)
}

function getRandomChar() {
  const rand = getRandomInt(0, 60) //122
  return String.fromCharCode(rand + 65) //22
}

type TextScrambleProps = {
  play:boolean,
  text:string,
  speed?:number,
  seed?:number,
  seedInterval?:number,
  step?:number,
  stepInterval?:number,
  scramble?:number,
  onComplete?: Function,
};

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  play = true,
  speed = 1,
  seed = 1,
  seedInterval = 10,
  step = 1,
  stepInterval = 1,
  scramble = 10,
  onComplete,
  ...rest
}:TextScrambleProps) => {
  // animation frame request
  const requestRef = React.useRef<number>(0)

  // 
  const fpsInterval = 1000 / (60 * speed)

  // time elapsed
  const elapsedRef = useRef<number>(0)
  
  // scramble tick
  const tickRef = useRef<number>(0)

  // current characted index ref
  const idxRef = useRef<number>(0)

  // scramble controller
  const scrambleRef = useRef<number[]>([])

  // text node ref
  const textRef = useRef<HTMLSpanElement>(null)

  // 
  const seedRandomCharacters = () => {
    for (var i = 0; i < seed; i++) {
      const pos = getRandomInt(idxRef.current, text.length)
      scrambleRef.current[pos] = scrambleRef.current[pos] || 0
    }
  }

  const moveCharIndex = () => {
    for (var i = 0; i < step; i++) {
      const currentIndex = idxRef.current
      scrambleRef.current[currentIndex] = scrambleRef.current[currentIndex] || 0
      idxRef.current += 1
    }
  }

  const animate = (time:number) => {
    requestRef.current = requestAnimationFrame(animate)
  
    const timeElapsed = time - elapsedRef.current;
  
    if (timeElapsed > fpsInterval) {
      elapsedRef.current = time
      draw();
    }
  }

  const draw = () => {
    if(!textRef.current) return;

    if (tickRef.current % seedInterval === 0) {
      seedRandomCharacters();
    }

    if (tickRef.current % stepInterval === 0) {
      moveCharIndex();
    }

    let newString = "";
    let done = 0;
    
    scrambleRef.current.forEach((char, idx) => {
      switch (true) {
        case text[idx] === " ":
          newString += " ";
          done++;
          break;
        case char >= scramble:
          newString += text[idx]
          done++;
          break;
        case char < scramble && idx <= idxRef.current:
          newString += getRandomChar();
          scrambleRef.current[idx] += 1;
          break;
        case char < scramble:
          newString += getRandomChar();
          break;
        default:
          newString += "<span>&nbsp;</span>";
      }
    });

    textRef.current.innerHTML = newString

    if (done === text.length) {
      cancelAnimationFrame(requestRef.current)
      if (onComplete) {
        onComplete()
      }
      return;
    }

    tickRef.current += 1;
  }

  React.useEffect(() => {
    tickRef.current = 0
    idxRef.current = 0
    scrambleRef.current = new Array(text.length)
  }, [text])

  React.useEffect(() => {
    if (play) {
      requestRef.current = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(requestRef.current)
    }
    return () => {
      cancelAnimationFrame(requestRef.current)
    }
  }, [animate, play]) // Make sure the effect runs only once

  return <span ref={textRef} {...rest} />
}