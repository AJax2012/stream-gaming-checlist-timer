import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { useSettings } from '@/store';
import { TimerInterval } from '@/types';

const Settings = () => {
  const {
    allowBreaks,
    eventTitle,
    timerIntervalInMilliseconds,
    setAllowBreaks,
    setEventTitle,
    setTimerIntervalInMilliseconds,
  } = useSettings();

  const toggleAllowBreaks = (value: string) => {
    setAllowBreaks(value === 'true' ? true : false);
  };

  return (
    <div>
      <h1 className="text-3xl">Settings</h1>
      <div className="flex justify-center text-left">
        <div className="w-1/2">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="eventTitle"
                type="text"
                placeholder="Enter event title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="timerInterval">Timer Interval</Label>
              <Select
                value={String(timerIntervalInMilliseconds) ?? '1000'}
                onValueChange={(e) =>
                  setTimerIntervalInMilliseconds(Number(e) as TimerInterval)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timer interval" />
                </SelectTrigger>
                <SelectContent id="timerInterval">
                  <SelectGroup>
                    <SelectItem value="10">10 milliseconds</SelectItem>
                    <SelectItem value="100">100 milliseconds</SelectItem>
                    <SelectItem value="1000">1 second</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Label htmlFor="allowBreaks">Allow Breaks</Label>
              <Select
                value={allowBreaks ? 'true' : 'false'}
                onValueChange={toggleAllowBreaks}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select allow breaks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
