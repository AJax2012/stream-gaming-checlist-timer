import { useMemo } from 'react';
import { colord } from 'colord';
import { RgbaStringColorPicker, RgbaColor } from 'react-colorful';
import { Input, Label } from './ui';

type Props = {
  color: string;
  id: string;
  label: string;
  setColor: (color: RgbaColor) => void;
};

const ColorPicker = ({ color, id, label, setColor }: Props) => {
  const hexColor = useMemo(() => colord(color).toHex(), [color]);

  const setColorFromHex = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(colord(e.target.value).toRgb());
  };

  const setRgbaColor = (color: string) => {
    setColor(colord(color).toRgb());
  };

  return (
    <div className="mb-8">
      <Label htmlFor={id} className='text-xl'>{label}</Label>
      <RgbaStringColorPicker
        id={id}
        color={color}
        onChange={setRgbaColor}
        className="my-2"
      />
      <div className="flex gap-2">
        <Input value={hexColor} onChange={setColorFromHex} className='w-28' />
        <Input
          value={colord(color).toRgbString()}
          onChange={(e) => setRgbaColor(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
