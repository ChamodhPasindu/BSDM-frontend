import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserRole } from 'src/app/enums/UserRole.enum';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { SESSION_DATA } from 'src/app/utility/constants/session-data';
import { alertWarning } from 'src/app/utility/helper';
import { SweetAlertResult } from 'sweetalert2';

@UntilDestroy()
@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
})
export class AdminHeaderComponent extends HeaderComponent implements OnInit {
  protected isDarkMode: boolean = false;
  @Input() public sidebarId: string = 'sidebar';

  public newMessages = new Array(4);
  public newTasks = new Array(5);
  public newNotifications = new Array(5);

  messages = [
    {
      sender: 'Jessica Williams',
      time: 'Just now',
      subject: 'Urgent: System Maintenance Tonight',
      preview:
        "Attention team, we'll be conducting critical system maintenance tonight from 10 PM to 2 AM.",
      avatar: './assets/images/user-img.jpg',
      status: 'bg-success',
      urgent: true,
    },
    {
      sender: 'Richard Johnson',
      time: '5 minutes ago',
      subject: 'Project Update: Milestone Achieved',
      preview:
        'Kudos on hitting sales targets last quarter! New goals ahead...',
      avatar: './assets/images/user-img.jpg',
      status: 'bg-warning',
      urgent: true,
    },
    {
      sender: 'Angela Rodriguez',
      time: '1:52 PM',
      subject: 'Social Media Campaign Launch',
      preview:
        'Exciting news! Our new social media campaign goes live tomorrow.',
      avatar: './assets/images/user-img.jpg',
      status: 'bg-danger',
      urgent: false,
    },
    {
      sender: 'Jane Lewis',
      time: '4:03 AM',
      subject: 'Inventory Checkpoint',
      preview:
        "Team, it's time for our monthly inventory check. Let's nail it.",
      avatar: './assets/images/user-img.jpg',
      status: 'bg-info',
      urgent: false,
    },
  ];

  protected readonly UserRole = UserRole;

  protected name: string;
  protected userRole: UserRole;
  protected lastLoggedInTime: string = '05 Nov 2025 | 12:50';

  constructor(
    private readonly router: Router,
    private readonly storageService: StorageService,
    private readonly authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.isDarkMode = localStorage.getItem('dark-theme') === '1';
    this.applyTheme();
    this.loadSessionData();
  }

  private loadSessionData(): void {
    this.name = this.storageService.get(SESSION_DATA.NAME)!;
    this.userRole = this.storageService.get(SESSION_DATA.ROLE) as UserRole;
    // this.name = this.storageService.get(SESSION_DATA.NAME);
  }

  protected onLogOut(): void {
    alertWarning(
      {
        title: 'Log Out',
        text: 'Are you sure you want to log out?',
      },
      (result: SweetAlertResult<any>) => {
        if (result.isConfirmed) {
          this.authService
            .logout()
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.router.navigate(['admin']);
              this.storageService.clearSession();
            });
        }
      }
    );
  }

  protected setTheme(dark: boolean): void {
    this.isDarkMode = dark;
    localStorage.setItem('dark-theme', dark ? '1' : '0');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
