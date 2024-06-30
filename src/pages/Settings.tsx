import { ChangeEvent } from 'react';
import { colord } from 'colord';
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
import { useAchievement, useEvent, useSettings, useTimer } from '@/store';
import { TimerInterval } from '@/types';
import { ColorPicker } from '../components';

const Settings = () => {
  const { events, handleSetEvents } = useEvent();
  const { achievements, handleSetAchievements } = useAchievement();

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
      achievements,
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
      handleSetAchievements(data.achievements);
      handleSetEvents(data.events);
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
                  <div className="relative">
                    <Input
                      id="eventTitle"
                      type="text"
                      placeholder="Enter event title"
                      className="peer event-title"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                    <Button
                      variant="ghost"
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
              <ColorPicker
                color={colord(backgroundColor).toRgbString()}
                id="backgroundColor"
                label="Background Color"
                setColor={setBackgroundColor}
              />
              <ColorPicker
                color={colord(cardColor).toRgbString()}
                id="cardColor"
                label="Card Color"
                setColor={setCardColor}
              />
              <ColorPicker
                color={colord(fontColor).toRgbString()}
                id="fontColor"
                label="Text Color"
                setColor={setFontColor}
              />
              <ColorPicker
                color={colord(timerPauseColor).toRgbString()}
                id="timerPauseColor"
                label="Timer Pause Color"
                setColor={setTimerPauseColor}
              />
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
