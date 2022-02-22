import { useContext } from 'react';
import { Category } from '@/entities';
import { Storage, StorageName } from '@/utils';
import AppContext from '@/contexts/AppContext';

export const useCategory = () => {
  const { categories, setCategories } = useContext(AppContext);
  const storage = new Storage<Category[]>();

  const saveCategoryies = (categories: Category[]) => {
    storage.save(StorageName.CAGEGORY, categories);
    setCategories(categories);
  };

  return {
    categories: sortCategory(categories ?? []),
    setCategories: saveCategoryies,
  };
};

const sortCategory = (categories: Category[]) => categories.sort((a, b) => a.sortIndex - b.sortIndex);

export const mockCategory = [
  {
    id: 'mock',
    title: 'オシャレに飲みたい',
    icon: '🍺',
    stations: [
      {
        companyName: '東京地下鉄',
        latitude: 35.63177,
        longitude: 139.7159,
        routeName: '南北線',
        stationName: '目黒',
        transfers: [
          {
            companyName: '東京都交通局',
            routeName: '三田線',
          },
          {
            companyName: '東急電鉄',
            routeName: '東急目黒線',
          },
          {
            companyName: '東日本旅客鉄道',
            routeName: '山手線',
          },
        ],
      },
      {
        companyName: '東京地下鉄',
        latitude: 35.65408,
        longitude: 139.73694,
        routeName: '南北線',
        stationName: '麻布十番',
        transfers: [
          {
            companyName: '東京都交通局',
            routeName: '大江戸線',
          },
        ],
      },
      {
        companyName: '東京地下鉄',
        latitude: 35.67205,
        longitude: 139.76391,
        routeName: '日比谷線',
        stationName: '銀座',
        transfers: [
          {
            companyName: '東京地下鉄',
            routeName: '銀座線',
          },
          {
            companyName: '東京地下鉄',
            routeName: '丸ノ内線',
          },
        ],
      },
      {
        companyName: '東京地下鉄',
        latitude: 35.66325,
        longitude: 139.73206,
        routeName: '日比谷線',
        stationName: '六本木',
        transfers: [
          {
            companyName: '東京都交通局',
            routeName: '大江戸線',
          },
        ],
      },
    ],
    sortIndex: -1,
  },
] as Category[];
