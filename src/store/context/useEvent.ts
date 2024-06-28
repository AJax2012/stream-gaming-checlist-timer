import { useContext } from 'react';
import { EventContext } from '../EventContext';

const useEvent = () => useContext(EventContext);

export default useEvent;
