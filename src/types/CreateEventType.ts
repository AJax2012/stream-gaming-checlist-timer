import EventTypeOption from './EventTypeOption';

type CreateEventType = {
  label: string;
  type: EventTypeOption;
  max?: number;
};

export default CreateEventType;
