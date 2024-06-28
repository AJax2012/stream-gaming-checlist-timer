import { useMemo } from 'react';
import cn from 'classnames';
import { Duration } from 'luxon';
import { FaPause, FaPlay } from 'react-icons/fa';

import { useSettings, useTimer } from '@/store';
import ResetTimer from './ResetTimer';
import { Button } from './ui';

const Timer = () => {
  const { timeInMilliseconds, isActive, isPaused, pause, resume, start } =
    useTimer();

  const { timerIntervalInMilliseconds, timerPauseColor } = useSettings();

  const format = useMemo(() => {
    switch (timerIntervalInMilliseconds) {
      case 10:
      case 100:
        return 'h:mm:ss.SSS';
      case 1000:
        return 'h:mm:ss';
    }
  }, [timerIntervalInMilliseconds]);

  return (
    <div className="flex justify-center gap-2">
      <Button className={cn({ hidden: isActive })} onClick={start}>
        Start
      </Button>
      <ResetTimer />
      <Button
        className={cn({ hidden: !isActive })}
        variant={isPaused ? 'secondary' : 'ghost'}
        onClick={isPaused ? resume : pause}
      >
        {isPaused ? <FaPlay /> : <FaPause />}
      </Button>
      <div
        className="text-3xl ml-5"
        style={{
          color: isPaused
            ? `rgb(${timerPauseColor.r}, ${timerPauseColor.g}, ${timerPauseColor.b})`
            : 'inherit',
        }}
      >
        {Duration.fromMillis(timeInMilliseconds).toFormat(format)}
      </div>
    </div>
  );
};

export default Timer;
