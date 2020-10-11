import { createContext } from 'react';
import calendarStore from './calendarStore';
import { useContext } from 'react';

const storesContext = createContext({ calendarStore });

const useStores = () => useContext(storesContext);

export default useStores;
