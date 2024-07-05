import { useSettings } from '@/store';
import { Card, CardContent, CardTitle } from './ui';
import Timer from './Timer';
import { colord } from 'colord';

const Header = () => {
  const { cardColor, eventTitle } = useSettings();

  return (
    <Card
      className="mx-auto max-w-2xl my-4"
      style={{
        backgroundColor: colord(cardColor).toRgbString(),
      }}
    >
      <CardTitle className="text-3xl my-5">{eventTitle}</CardTitle>
      <CardContent>
        <Timer />
      </CardContent>
    </Card>
  );
};

export default Header;
