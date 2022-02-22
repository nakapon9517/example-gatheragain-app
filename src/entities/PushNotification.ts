export type PushNotificationRequest = {
  to: string;
  title: string;
  subtitle: string;
  body: string;
  sound: string | null; // nullの場合は着信音なし, defaultの場合はデフォルト通知音
  badge: number;
  data: any;
};

export type PushNotification = {
  shareId: string | undefined;
  badge: number | null | undefined;
  date: Date;
};
