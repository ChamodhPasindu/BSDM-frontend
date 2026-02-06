import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  protected currentStep: number = 1;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateStepBasedOnRoute();
      });
  }

  private updateStepBasedOnRoute(): void {
    const activeRoute = this.getActiveRoute(this.activatedRoute);

    // Decide step based on route path
    const path = activeRoute.snapshot.routeConfig?.path;
    switch (path) {
      case 'select-route':
        this.currentStep = 1;
        break;
      case 'select-customer':
        this.currentStep = 2;
        break;
      case 'select-bill':
        this.currentStep = 3;
        break;
      default:
        this.currentStep = 1;
    }
  }

  // Recursive function to get the deepest child route
  private getActiveRoute(route: ActivatedRoute): ActivatedRoute {
    if (route.firstChild) {
      return this.getActiveRoute(route.firstChild);
    } else {
      return route;
    }
  }
}
