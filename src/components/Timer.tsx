import { useMemo } from 'react';
import cn from 'classnames';
import { Duration } from 'luxon';
import { useSession, useTimer } from '@/store';
import { Button } from './ui';
import { FaPause, FaPlay } from 'react-icons/fa';

const Timer = () => {
  const { timeInMilliseconds, isActive, isPaused, pause, resume, start } =
    useTimer();
  const { allowBreaks, timerIntervalInMilliseconds } = useSession();

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
    <div className="flex justify-center">
      <Button className={cn({ hidden: isActive })} onClick={start}>Start</Button>
      <Button className={cn({ hidden: !isActive || !allowBreaks })} variant={isPaused ? 'secondary' : 'ghost'} onClick={isPaused ? resume : pause}>
        {isPaused ? <FaPlay /> : <FaPause />}
      </Button>
      <div
        className={cn('text-3xl ml-5', { 'text-black': !isPaused, 'text-red-500': isPaused })}
      >
        {Duration.fromMillis(timeInMilliseconds).toFormat(format)}
      </div>
    </div>
  );
};

export default Timer;
