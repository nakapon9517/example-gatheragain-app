import { RootStackParamList } from '@/entities';
import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: 'home',
          GatherCreate: 'gather/create',
          GatherList: 'gather/list',
        },
      },
      NotFound: '*',
      Settings: 'settings',
      CategoryRegister: 'category/register',
      GatherPreview: 'gather/preview',
      GatherRegister: 'gather/register',
      SharePreview: 'share/preview',
      StationPreview: 'station/preview',
      StationSelector: 'station/selector',
    },
  },
};

export default linking;
