import { useMemo } from 'react';
import { colord } from 'colord';
import { RgbaStringColorPicker, RgbaColor } from 'react-colorful';
import { useDebouncedCallback } from 'use-debounce';
import { Input, Label } from './ui';

type Props = {
  color: string;
  id: string;
  isRgba?: boolean;
  label: string;
  setColor: (color: RgbaColor) => void;
};

const ColorPicker = ({ color, id, isRgba = false, label, setColor }: Props) => {
  const hexColor = useMemo(
    () => colord(color).toHex().replace('#', ''),
    [color]
  );
  const rgbaColor = useMemo(() => {
    let rgb = colord(color)
      .toRgbString()
      .replace(/rgba?\(/g, '')
      .replace(')', '');
    if (isRgba && rgb.split(',').length === 3) {
      rgb += ', 1';
    }

    return rgb;
  }, [color]);

  const setColorFromHex = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setColor(colord(`#${e.target.value}`).toRgb());
    },
    500
  );

  const setRgbaColor = useDebouncedCallback((color: string) => {
    const prefix = isRgba ? 'rgba(' : 'rgb(';
    setColor(colord(`${prefix}${color})`).toRgb());
  }, 500);

  return (
    <div className="mb-8">
      <Label htmlFor={id} className="text-xl">
        {label}
      </Label>
      <RgbaStringColorPicker
        id={id}
        color={color}
        onChange={(color) => setColor(colord(color).toRgb())}
        className="my-2"
      />
      <div className="flex gap-2 relative">
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500 sm:text-sm">
            #
          </span>
          <Input
            defaultValue={hexColor}
            onChange={setColorFromHex}
            className="pl-6"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500 sm:text-sm">
            {isRgba ? 'rgba' : 'rgb'}
          </span>
          <Input
            defaultValue={rgbaColor}
            onChange={(e) => setRgbaColor(e.target.value)}
            className="pl-12"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
