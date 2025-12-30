import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ICustomizeRouteData } from 'src/app/interfaces/ICustomizeRouteData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { RouteService } from 'src/app/services/route/route.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-select-route',
  templateUrl: './select-route.component.html',
  styleUrls: ['./select-route.component.scss'],
})
export class SelectRouteComponent implements OnInit {
  protected routeList: ICustomizeRouteData[] = [];
  protected filteredRouteList: ICustomizeRouteData[] = [];

  protected routeSearchTerm: string;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.loadRouteList();
  }

  private loadRouteList(): void {
    this.routeService
      .getSalesmanRouteList()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.routeList = res.body.content;
            this.filteredRouteList = this.routeList;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.ROUTE_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected filterRoutes(): void {
    const term = this.routeSearchTerm.toLowerCase();
    this.filteredRouteList = this.routeList.filter(
      (route: ICustomizeRouteData) =>
        route.routeName.toLowerCase().includes(term)
    );
  }

  protected navigateNext(route: ICustomizeRouteData): void {
    this.routeService.setSelectedRoute(route);
    this.router.navigate(['../select-customer'], {
      relativeTo: this.route,
    });
  }
}
