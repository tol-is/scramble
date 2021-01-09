# Scramble

A scramble text UI component for react.

The animation maintains an internal ticking clock, that runs up to 60 times per second, or once per animation frame. The animation starts from the beginning of the input text, and scrambles until the end of the input, given a set of control parameters that allow you to control how many characters are added and over how many ticks, and how many times each character is randomized.

Live demo at [https://scramble.vercel.app/](https://scramble.vercel.app/)

### Props

| Property  | type  | default | description |
|---|---|---|---|
| as   | string | - | polymorphic tag |
| play   | boolean | true | start/stop animation |
| text   | string  | - | text to scramble. |
|  speed | number  | 0.4 | 0-1 range that determines the ticking speed. 1 means 1 tick per frame |
|  scramble | number | 8 | how many times each character will randomize   |
|  step | number | 1 | how many characters are added to the scramble on each tick   |
|  stepInterval | number | 1 | how many ticks it requires to increment the step index  |
|  seed | number | 3 | adds random characters to the scramble, ahead of the ticking loop  |
|  seedInterval | number | 10 | ticks required to seed more random characters  |
|  onComplete | function | - | callback invoked on completion  |


### Installation


```js
  yarn add @a7sc11u/scramble
  //or
  npm install @a7sc11u/scramble
```

### Usage

```jsx
import { TextScramble } from '@a7sc11u/scramble';

export const App = () => {

  const elRef = React.useRef<HTMLDivElement>(null);

  const handleComplete = () => {
    console.log('scramble is done');
  }

  return (
    <TextScramble 
      ref={elRef}
      as="div"
      play={true}
      speed={0.4}
      scramble={8}
      step={1}
      stepInterval={1}
      seed={3}
      seedInterval={10}
      onComplete={handleComplete}
      text="Fugiat ullamco non magna dolor excepteur." 
    />
  );
};
```
