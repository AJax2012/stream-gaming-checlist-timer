type CreateEventType = {
  label: string;
  type: 'counter' | 'completed';
  max?: number;
  order?: number;
};

export default CreateEventType;
