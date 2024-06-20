import { useContext } from 'react';
import { EventContext } from '../EventContext';

export const useEvent = () => useContext(EventContext);
