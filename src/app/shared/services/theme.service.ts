import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<string>('light');
  currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }

  setTheme(theme: string) {
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      this.currentThemeSubject.next(systemTheme);
      localStorage.setItem('theme', 'system');
      document.body.className = systemTheme;
    } else {
      this.currentThemeSubject.next(theme);
      localStorage.setItem('theme', theme);
      document.body.className = theme;
    }
  }

  getCurrentTheme() {
    return this.currentThemeSubject.value;
  }
}
