import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './utility/common/icon-subset';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected title = 'Visco BSDM Solution';

  constructor(
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly iconSetService: IconSetService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    this.iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    const isDarkMode = localStorage.getItem('dark-theme') === '1';

    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    }
  }
}
