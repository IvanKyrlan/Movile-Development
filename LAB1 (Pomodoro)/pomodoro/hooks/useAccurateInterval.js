import { useEffect, useRef } from 'react';

function useAccurateInterval(timerRunning, callBack, interval) {
  const currentTimeoutRef = useRef(null);

  const getAccurateInterval = (callback, delay) => {
    let nextTimer = Date.now();
    let lastTick = nextTimer;

    return function getNextTimeout() {
      const tickTime = Date.now();
      const timeElapsed = tickTime - lastTick;
      lastTick = tickTime;
      nextTimer += delay;
      currentTimeoutRef.current = setTimeout(() => {
        callback(timeElapsed);
        getNextTimeout();
      }, nextTimer - tickTime);
    };
  };

  useEffect(() => {
    if (timerRunning && currentTimeoutRef.current === null) {
      getAccurateInterval(callBack, interval)();
    }
    
    return () => {
      clearTimeout(currentTimeoutRef.current);
      currentTimeoutRef.current = null;
    };
  }, [timerRunning, callBack, interval]);
}

export default useAccurateInterval;
