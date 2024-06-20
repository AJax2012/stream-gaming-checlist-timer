import { RgbColorPicker, RgbaColorPicker } from 'react-colorful';
import { MdClose } from 'react-icons/md';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { useEvent, useSettings, useTimer } from '@/store';
import { TimerInterval } from '@/types';
import { ChangeEvent } from 'react';

const Settings = () => {
  const { events, eventTypes, setAllEvents } = useEvent();

  const {
    backgroundColor,
    backgroundPicture,
    cardColor,
    fontColor,
    eventTitle,
    timerIntervalInMilliseconds,
    timerPauseColor,
    setBackgroundColor,
    setBackgroundPicture,
    setCardColor,
    setFontColor,
    setEventTitle,
    setTimerIntervalInMilliseconds,
    setTimerPauseColor,
    resetBackgroundPicture,
    resetCustomizations,
  } = useSettings();

  const { timeInMilliseconds, setTimer } = useTimer();

  const handleBackgroundFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) {
      return;
    }

    setBackgroundPicture(URL.createObjectURL(file));
  };

  const handleClearEventTitle = () => {
    setEventTitle('');
  };

  const handleSettingsDownload = () => {
    const link = document.createElement('a');
    link.download = 'game-stream-settings.json';

    const data = JSON.stringify({
      backgroundColor,
      backgroundPicture,
      cardColor,
      events,
      eventTypes,
      fontColor,
      eventTitle,
      timerIntervalInMilliseconds,
      timeInMilliseconds,
      timerPauseColor,
    });

    link.href = URL.createObjectURL(
      new Blob([data], { type: 'application/json' })
    );
    link.click();
  };

  const handleSettingsUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target?.result as string);
      setBackgroundColor(data.backgroundColor);
      setBackgroundPicture(data.backgroundPicture);
      setCardColor(data.cardColor);
      setEventTitle(data.eventTitle);
      setFontColor(data.fontColor);
      setTimerIntervalInMilliseconds(data.timerIntervalInMilliseconds);
      setTimerPauseColor(data.timerPauseColor);
      setAllEvents(data.eventTypes, data.events);
      setTimer(data.timeInMilliseconds);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Card
        className="mx-auto max-w-2xl my-4"
        style={{
          backgroundColor: `rgba(${cardColor.r}, ${cardColor.g}, ${cardColor.b}, ${cardColor.a})`,
        }}
      >
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center text-left">
            <div className="w-1/2">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid w-full max-w-sm items-center gap-1.5 mb-4">
                  <Label htmlFor="fileUpload">Upload Settings File</Label>
                  <Input
                    id="fileUpload"
                    type="file"
                    accept="application/json"
                    onChange={handleSettingsUpload}
                  />
                  <Button onClick={handleSettingsDownload}>
                    Download Settings File
                  </Button>
                </div>
                <div className="mb-4">
                  <Label htmlFor="eventTitle">Event Title</Label>
                  <div className='relative'>
                    <Input
                      id="eventTitle"
                      type="text"
                      placeholder="Enter event title"
                      className='peer event-title'
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                    <Button
                      variant='ghost'
                      onClick={handleClearEventTitle}
                      className="hidden peer-focus:flex peer-hover:flex absolute inset-y-0 right-0 pr-3"
                    >
                      <MdClose />
                    </Button>
                  </div>
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
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card
        className="mx-auto max-w-2xl my-4"
        style={{
          backgroundColor: `rgba(${cardColor.r}, ${cardColor.g}, ${cardColor.b}, ${cardColor.a})`,
        }}
      >
        <CardHeader>
          <CardTitle>Display Customizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center text-left">
            <div className="w-1/2">
              <div className="grid w-full max-w-sm items-center gap-1.5 mb-4">
                <Label htmlFor="backgroundPicture">Background Picture</Label>
                <Input
                  id="backgroundPicture"
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundFileUpload}
                />
                <Button onClick={resetBackgroundPicture}>
                  Reset Background Picture
                </Button>
              </div>
              <div className="mb-4">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <RgbaColorPicker
                  id="backgroundColor"
                  className="mt-1"
                  color={backgroundColor}
                  onChange={setBackgroundColor}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="cardColor">Card Color</Label>
                <RgbaColorPicker
                  id="cardColor"
                  className="mt-1"
                  color={cardColor}
                  onChange={setCardColor}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="fontColor">Text Color</Label>
                <RgbColorPicker
                  id="fontColor"
                  className="mt-1"
                  color={fontColor}
                  onChange={setFontColor}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="timerPauseColor">Timer Pause Color</Label>
                <RgbColorPicker
                  id="timerPauseColor"
                  className="mt-1"
                  color={timerPauseColor}
                  onChange={setTimerPauseColor}
                />
              </div>
              <Button onClick={resetCustomizations}>
                Reset Customizations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Settings;
