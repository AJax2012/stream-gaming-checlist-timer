import { useState } from 'react';
import { Button, Input, Label } from './ui';

type Props = {
  max?: number;
  label: string;
};

const CounterItem = ({ max, label }: Props) => {
  const [count, setCount] = useState(0);

  const increment = () => {
    if (max && count < max) {
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  return (
    <div className="flex">
      <Label>{label}</Label>
      <Button onClick={decrement} className="rounded-none rounded-s-lg">
        -
      </Button>
      <Input
        type="number"
        className="w-12 rounded-none text-right px-1"
        value={count}
        disabled
      />
      <Button onClick={increment} className="rounded-none rounded-e-lg">
        +
      </Button>
    </div>
  );
};

export default CounterItem;
