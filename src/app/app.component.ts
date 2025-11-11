import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './utility/common/icon-subset';
import { GeneralService } from './services/general/general.service';
import { IToastItem } from './interfaces/IToastItem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected readonly title = 'Visco BSDM Solution';

  protected toasts: IToastItem[] = [];

  constructor(
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly iconSetService: IconSetService,
    private readonly generalService: GeneralService
  ) {
    titleService.setTitle(this.title);
    this.iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    this.handleConnection();
    this.handleTheme();
  }

  protected handleTheme(): void {
    const isDarkMode = localStorage.getItem('dark-theme') === '1';

    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    }
  }

  protected handleConnection(): void {
    this.generalService.isOnlineChanges$.subscribe((status) => {
      if (!status && !this.toasts.find((t) => t.title === 'Connection Lost')) {
        this.toasts.push({
          color: 'danger',
          title: 'Connection Lost',
          body: 'You are offline. Some features may not work.',
          delay: 3000,
          autohide: true,
        });
      } else {
        this.toasts = this.toasts.filter((t) => t.title !== 'Connection Lost');
        this.toasts.push({
          color: 'success',
          title: 'Back Online',
          body: 'Internet connection restored.',
          delay: 3000,
          autohide: true,
        });
      }
    });
  }
}
