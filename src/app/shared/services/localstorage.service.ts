import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private localStorage: any = localStorage;
  private prefix: string = 'app-vrs';

  getValue<T>(key: string): T {
    return JSON.parse(<string>this.localStorage.getItem(`${this.prefix}-${key}`));
  }

  setValue(option: { key: string; value: any }): void {
    if (this.localStorage.getItem(`${this.prefix}-${option.key}`)) {
      this.localStorage.removeItem(`${this.prefix}-${option.key}`);
    }
    this.localStorage.setItem(`${this.prefix}-${option.key}`, JSON.stringify(option.value));
  }

  removeValue(key: any): void {
    this.localStorage.removeItem(`${this.prefix}-${key}`);
  }
}
