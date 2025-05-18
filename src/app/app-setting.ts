import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {firstValueFrom} from "rxjs";

export class Setting {
  BASE_API_URL: string = ''
  APP_NAME: string = ""
  APP_ICON: string = "https://sec-core.sgx.bz/files/22/12/logo_text-black-02_.png"
}

@Injectable({ providedIn: 'root' })
export class SettingService {
  public setting: Setting;
  constructor() {
    this.setting = new Setting();
  }
}


@Injectable({ providedIn: 'root' })
export class SettingHttpService {

  constructor(private http: HttpClient, private settingsService: SettingService) {
  }

  async initializeApp(): Promise<void> {
    try {
      this.settingsService.setting = await firstValueFrom(
        this.http.get<Setting>('./setting.json')
      );
    } catch (error) {
      console.error(error);
    }
  }
}
