import { ChangeEvent } from 'react';
import { colord } from 'colord';
import { FaCheck } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { useAchievement, useEvent, useSettings, useTimer } from '@/store';
import { CompletedButtonVariant, TimerInterval } from '@/types';
import { ColorPicker } from '@/components';

const Settings = () => {
  const { events, handleSetEvents } = useEvent();
  const { achievements, handleSetAchievements } = useAchievement();

  const {
    backgroundColor,
    backgroundPicture,
    cardColor,
    completedButtonVariant,
    fontColor,
    eventTitle,
    timerIntervalInMilliseconds,
    timerPauseColor,
    setBackgroundColor,
    setBackgroundPicture,
    setCardColor,
    setCompletedButtonVariant,
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
      completedButtonVariant,
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
      setCompletedButtonVariant(data.completedButtonVariant);
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
    <section id="settings-content" style={{ color: colord(fontColor).toHex() }}>
      <Card
        className="mx-auto max-w-2xl my-4"
        style={{
          backgroundColor: colord(cardColor).toRgbString(),
        }}
      >
        <CardHeader>
          <CardTitle className="text-3xl">Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center text-left">
            <div className="w-2/3">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid w-full max-w-sm items-center gap-1.5 mb-4">
                  <Label htmlFor="fileUpload" className="text-xl">
                    Upload Settings File
                  </Label>
                  <Input
                    id="fileUpload"
                    type="file"
                    accept="application/json"
                    onChange={handleSettingsUpload}
                    className="mt-2"
                  />
                  <Button onClick={handleSettingsDownload}>
                    Download Settings File
                  </Button>
                </div>
                <div className="mb-4">
                  <Label htmlFor="eventTitle" className="text-xl">
                    Event Title
                  </Label>
                  <div className="relative mt-2">
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
                  <Label htmlFor="timerInterval" className="text-xl">
                    Timer Interval
                  </Label>
                  <div className="mt-2">
                    <Select
                      value={String(timerIntervalInMilliseconds) ?? '1000'}
                      onValueChange={(e) =>
                        setTimerIntervalInMilliseconds(
                          Number(e) as TimerInterval
                        )
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
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card
        className="mx-auto max-w-2xl my-4"
        style={{
          backgroundColor: colord(cardColor).toRgbString(),
        }}
      >
        <CardHeader>
          <CardTitle className="text-3xl">Display Customizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center text-left">
            <div className="w-2/3">
              <div className="grid w-full max-w-sm items-center gap-1.5 mb-8">
                <Label htmlFor="backgroundPicture" className="text-xl">
                  Background Picture
                </Label>
                <Input
                  id="backgroundPicture"
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundFileUpload}
                  className="mt-2"
                />
                <Button onClick={resetBackgroundPicture}>
                  Reset Background Picture
                </Button>
              </div>
              <RadioGroup
                name="buttonVariant"
                defaultValue="outline"
                className="mb-8"
                onValueChange={(value: CompletedButtonVariant) =>
                  setCompletedButtonVariant(value)
                }
              >
                <Label htmlFor="buttonVariant" className="text-xl">
                  Completed Button Type
                </Label>
                <div className="flex gap-6 mt-2">
                  <div className="flex gap-3 items-center">
                    <RadioGroupItem
                      id="buttonVariantOutlined"
                      value="outline"
                      defaultChecked
                      checked={completedButtonVariant === 'outline'}
                    />
                    <Label>
                      <Button
                        variant="outline"
                        onClick={() => setCompletedButtonVariant('outline')}
                      >
                        <FaCheck color="green" />
                      </Button>
                    </Label>
                  </div>
                  <div className="flex gap-3 items-center">
                    <RadioGroupItem
                      id="buttonVariantFilled"
                      value="filled"
                      checked={completedButtonVariant === 'filled'}
                    />
                    <Label>
                      <Button
                        variant="green"
                        onClick={() => setCompletedButtonVariant('filled')}
                      >
                        <FaCheck color="white" />
                      </Button>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
              <ColorPicker
                isRgba
                color={colord(backgroundColor).toRgbString()}
                id="backgroundColor"
                label="Background Color"
                setColor={setBackgroundColor}
              />
              <ColorPicker
                isRgba
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
    </section>
  );
};

export default Settings;
