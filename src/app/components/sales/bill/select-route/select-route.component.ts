import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-select-route',
  templateUrl: './select-route.component.html',
  styleUrls: ['./select-route.component.scss'],
})
export class SelectRouteComponent implements OnInit {
  selectedRoute: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.filteredRoutes = [...this.routes];
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.entryType = params['context'];
    });
  }

  routes = [
    'Route A',
    'Route B',
    'Route C',
    'Route D',
    'Main Street',
    'North Line',
  ];
  filteredRoutes: string[] = [];
  routeSearchTerm: string = '';

  entryType: 'new' | 'existing' = 'existing';

  filterRoutes() {
    const term = this.routeSearchTerm.toLowerCase();
    this.filteredRoutes = this.routes.filter((r) =>
      r.toLowerCase().includes(term)
    );
  }

  selectRoute(route: string) {
    this.selectedRoute = route;
  }

  navigateNext() {
    if (this.entryType === 'new') {
      this.router.navigate(['../new-customer'], {
        relativeTo: this.route,
        queryParams: { type: this.entryType },
      });
    } else {
      this.router.navigate(['../existing-customer'], {
        relativeTo: this.route,
        queryParams: { type: this.entryType },
      });
    }
  }
}
