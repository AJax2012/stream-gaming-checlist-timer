import { RgbColorPicker, RgbaColorPicker } from 'react-colorful';
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
import { useEvent, useSettings } from '@/store';
import { TimerInterval } from '@/types';

const Settings = () => {
  const {
    events,
    eventTypes,
    setAllEvents,
  } = useEvent();
  const {
    allowBreaks,
    backgroundColor,
    backgroundPicture,
    cardColor,
    fontColor,
    eventTitle,
    timerIntervalInMilliseconds,
    timerPauseColor,
    setAllowBreaks,
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

  const toggleAllowBreaks = (value: string) => {
    setAllowBreaks(value === 'true' ? true : false);
  };

  const handleBackgroundFileUpload = (event: any) => {
    const file = event?.target?.files[0];
    if (!file) {
      return;
    }

    setBackgroundPicture(URL.createObjectURL(file));
  };

  const handleSettingsDownload = () => {
    const link = document.createElement('a');
    link.download = 'game-stream-settings.json';

    const data = JSON.stringify({
      allowBreaks,
      backgroundColor,
      backgroundPicture,
      cardColor,
      events,
      eventTypes,
      fontColor,
      eventTitle,
      timerIntervalInMilliseconds,
      timerPauseColor,
    });

    link.href = URL.createObjectURL(
      new Blob([data], { type: 'application/json' })
    );
    link.click();
  };

  const handleSettingsUpload = (event: any) => {
    const file = event?.target?.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target?.result as string);
      setAllowBreaks(data.allowBreaks);
      setBackgroundColor(data.backgroundColor);
      setBackgroundPicture(data.backgroundPicture);
      setCardColor(data.cardColor);
      setEventTitle(data.eventTitle);
      setFontColor(data.fontColor);
      setTimerIntervalInMilliseconds(data.timerIntervalInMilliseconds);
      setTimerPauseColor(data.timerPauseColor);
      setAllEvents(data.eventTypes, data.events);
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
                  value={backgroundPicture}
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
