import { Component, Input, OnInit } from '@angular/core';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
})
export class AdminHeaderComponent extends HeaderComponent implements OnInit {
  isDarkMode = false;
  @Input() sidebarId: string = 'sidebar';

  public newMessages = new Array(4);
  public newTasks = new Array(5);
  public newNotifications = new Array(5);

  constructor(private classToggler: ClassToggleService) {
    super();
  }

  ngOnInit() {
    this.isDarkMode = localStorage.getItem('dark-theme') === '1';
    this.applyTheme();
  }

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

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);

    // Save preference
    localStorage.setItem('dark-theme', this.isDarkMode ? '1' : '0');
  }

  setTheme(dark: boolean): void {
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
