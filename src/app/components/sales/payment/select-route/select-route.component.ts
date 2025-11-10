import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from "@coreui/angular";

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
    this.router.navigate(['../select-customer'], {
      relativeTo: this.route,
    });
  }
}
