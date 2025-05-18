import { Component } from '@angular/core';
import {LanguageService} from './shared/services/language.service';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`

  `],
  standalone: false
})
export class AppComponent {

  constructor(
    public languageService: LanguageService,
  ) {
    this.languageService.initialLanguage();
  }
}
