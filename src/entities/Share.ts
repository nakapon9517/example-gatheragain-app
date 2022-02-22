import { Timestamp } from 'firebase/firestore';
import { Station } from '.';

export type Share = {
  id: string;
  ownerId: string;
  category: VisibleCategory;
  colors: string[];
  title: string;
  userRoutes: UserRoute[];
  visible: boolean;
  updatedTime: Timestamp;
  createdTime: Timestamp;
};

export type VisibleCategory = {
  id: string;
  title: string;
  icon: string | null;
  stationNames: string[];
  sortIndex: number;
};

export type Category = {
  id: string;
  title: string;
  icon: string | null;
  stations: Station[];
  sortIndex: number;
};

export type UserRoute = {
  userId: string;
  userName: string;
  visible: boolean;
  routes: Route[];
};

export type Route = {
  stationFrom: string;
  stationTo: string;
  transferCount: number;
  rideTime: number;
};
