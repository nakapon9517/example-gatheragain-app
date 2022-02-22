import { UserRoute, VisibleCategory } from '.';
import { Timestamp } from 'firebase/firestore';

export type Gather = {
  id: string;
  ownerId: string;
  shareId: string;
  userId: string;
  category: VisibleCategory;
  colors: string[];
  title: string;
  userRoutes: UserRoute[];
  visible: boolean;
  updatedTime: Timestamp;
  createdTime: Timestamp;
};
