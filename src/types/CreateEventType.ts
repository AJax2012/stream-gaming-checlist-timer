import EventTypeOption from './EventTypeOption';

type CreateEventType = {
  label: string;
  type: EventTypeOption;
  max?: number;
  celebrateOnCompleted: boolean;
};

export default CreateEventType;
