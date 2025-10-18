import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

registerLocaleData(localePl);

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    { provide: 'LOCALE_ID', useValue: 'pl' } // optional if already in component
  ]
}).catch(err => console.error(err));
