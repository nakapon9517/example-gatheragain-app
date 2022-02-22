import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Station } from './Station';
import { Category, Gather } from '.';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

type CategoryInfo = Omit<Category, 'sortIndex'> & { maxSelectSize: number };

export enum ScreenType {
  Category = 'category',
  Settings = 'settings',
  Gather = 'gather',
  GatherEditer = 'gather_editer',
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  NotFound: undefined;
  Introduction: { isCategory: boolean };
  Settings: undefined;
  CategoryRegister: CategoryInfo;
  GatherPreview: { gather: Gather };
  GatherRegister: { gather?: Gather; station?: Station };
  GatherEditer: { gather?: Gather; station?: Station };
  SharePreview: { shareId: string };
  StationPreview: { station: Station };
  StationSelector: CategoryInfo & { type: ScreenType; gather?: Gather };
  WebView: { title: string; uri: string };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Home: { id?: string };
  GatherCreate: undefined;
  GatherList: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
