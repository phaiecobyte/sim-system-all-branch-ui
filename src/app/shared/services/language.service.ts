import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NzI18nService } from "ng-zorro-antd/i18n";
import {Locale} from '../../const';

@Injectable({ providedIn: 'root' })

export class LanguageService {
  constructor(
    public translate: TranslateService,
    private i18n: NzI18nService,
  ) { }

  switchLanguage(key: any) {
    this.translate.use(key.localId);
    this.i18n.setLocale(key.local);
    // this.localStorageService.setValue({ key: APP_STORAGE_KEY.LANGUAGE, value: key.localId })
  }

  initialLanguage() {
    let language: { local?: any, localId?: string } = {};
    for (let key in Locale) {
      if (Locale[key].localId == 'km') {
        language = Locale[key];
        break;
      }
    }
    this.translate.use(language.localId ?? Locale.DEFAULT.localId);
    this.i18n.setLocale(language.local ?? Locale.DEFAULT.local);
  }
}

