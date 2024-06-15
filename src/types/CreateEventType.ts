type CreateEventType = {
  label: string;
  type: 'counter' | 'completed';
  max?: number;
};

export default CreateEventType;
