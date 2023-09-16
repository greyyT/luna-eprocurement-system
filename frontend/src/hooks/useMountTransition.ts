import { useState, useEffect } from 'react';

const useMountTransition = (isMounted: boolean, duration: number): boolean => {
  const [hasTransitionedIn, setHasTransitionedIn] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isMounted && !hasTransitionedIn) {
      setHasTransitionedIn(true);
    } else if (!isMounted && hasTransitionedIn) {
      timeoutId = setTimeout(() => setHasTransitionedIn(false), duration);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [duration, isMounted, hasTransitionedIn]);

  return hasTransitionedIn;
};

export default useMountTransition;
