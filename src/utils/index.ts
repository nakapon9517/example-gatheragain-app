import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export * from './hooks/useCallable';
export * from './logger/Logger';
export * from './Formatter';
export * from './Storage';
export * from './StoreReview';

export const chunk = <T>(array: T[], size: number): T[][] => {
  return array.reduce(
    (acc, _, index) => (index % size ? acc : [...acc, array.slice(index, index + size)]),
    [] as T[][],
  );
};

export const getRandomNumber = (max: number, min?: number) => {
  return Math.floor(Math.random() * (max - (min ?? 0))) + (min ?? 0);
};

export const getUUIDV4 = () => {
  return uuidv4();
};

export const getRandomColor = (opacity?: number) => {
  return `rgba(${getRandomNumber(255)},${getRandomNumber(255)},${getRandomNumber(255)},${opacity ?? 1})`;
};
