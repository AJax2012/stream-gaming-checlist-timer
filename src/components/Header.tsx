import { useSettings } from '@/store';
import { Card, CardContent, CardTitle } from './ui';
import Timer from './Timer';

const Header = () => {
  const { eventTitle } = useSettings();

  return (
    <Card className="mx-auto max-w-2xl my-4">
      <CardTitle className="text-3xl my-5">{eventTitle}</CardTitle>
      <CardContent>
        <Timer />
      </CardContent>
    </Card>
  );
};

export default Header;
