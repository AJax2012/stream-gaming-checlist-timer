import React, { useEffect, useMemo } from 'react';
import { colord } from 'colord';
import { useFormik } from 'formik';
import noop from 'lodash/noop';
import { RgbaColor, RgbaStringColorPicker } from 'react-colorful';
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
  const getHexInput = (color: string) => {
    const { r, g, b } = colord(color).toRgb();
    const hex = colord({ r, g, b }).toHex().replace('#', '');
    return hex;
  };

  const getRgbaInput = (color: string) => {
    let rgb = colord(color)
      .toRgbString()
      .replace(/rgba?\(/g, '')
      .replace(')', '');

    if (isRgba && rgb.split(',').length === 3) {
      rgb += ', 1';
    }

    return rgb;
  };

  const hexColor = useMemo(() => getHexInput(color), [color]);
  const rgbaColor = useMemo(() => getRgbaInput(color), [color]);

  const { setFieldValue, values } = useFormik({
    initialValues: {
      hexColor,
      rgbaColor,
    },
    onSubmit: noop,
    enableReinitialize: false,
  });

  useEffect(() => {
    setFieldValue('hexColor', hexColor);
    setFieldValue('rgbaColor', rgbaColor);
  }, [hexColor, rgbaColor]);

  const debounce = useDebouncedCallback((color: string) => {
    setColor(colord(color).toRgb());
  }, 1000);

  const setColorFromPicker = (color: string) => {
    setColor(colord(color).toRgb());
  };

  const setColorFromHex = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue('hexColor', e.target.value);
    debounce(`#${e.target.value}`);
  };

  const setColorFromRgba = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue('rgbaColor', e.target.value);
    const prefix = isRgba ? 'rgba(' : 'rgb(';
    debounce(`${prefix}${e.target.value})`);
  };

  return (
    <div className="mb-8">
      <Label htmlFor={id} className="text-xl">
        {label}
      </Label>
      <RgbaStringColorPicker
        id={id}
        color={color}
        onChange={setColorFromPicker}
        className="my-2"
      />
      <div className="flex gap-2 relative">
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500 sm:text-sm">
            #
          </span>
          <Input
            id={`${id}Hex`}
            name="hexColor"
            value={values.hexColor}
            onChange={setColorFromHex}
            className="pl-6"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500 sm:text-sm">
            {isRgba ? 'rgba' : 'rgb'}
          </span>
          <Input
            id={`${id}Rgba`}
            name="rgbaColor"
            value={values.rgbaColor}
            onChange={setColorFromRgba}
            className="pl-12"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
