import * as React from 'react';
import { useEffect } from 'react';
import { TextScramble } from '../.';

export const App = () => {
  const elRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="App">
      <TextScramble
        ref={elRef}
        as="div"
        text="Fugiat ullamco non magna dolor excepteur."
      />
    </div>
  );
};
