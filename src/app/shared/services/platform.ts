import { Injectable, signal } from '@angular/core';
import { getPlatforms } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class Platform {
  platforms = signal(getPlatforms());
  isMobile = this.platforms().includes('mobile');
  isIOS = this.platforms().includes('ios');
  isAndroid = this.platforms().includes('android');
  isDesktop = this.platforms().includes('desktop');
  isPWA = this.platforms().includes('pwa');
}
