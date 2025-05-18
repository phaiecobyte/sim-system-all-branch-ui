import {en_US, km_KH} from 'ng-zorro-antd/i18n';

export const APP_STORAGE_KEY = {
  AUTHORIZED: "authorized",
};

export const PAGE_SIZE_OPTION = [3, 5, 10, 25, 50, 100];

export const Locale: { KH: any; EN: any; DEFAULT: any } | any = {
  KH: { local: km_KH, localId: 'km' },
  EN: { local: en_US, localId: 'en' },
  DEFAULT: { local: en_US, localId: 'en' },
};
