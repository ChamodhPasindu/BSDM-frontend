import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewVehicleComponent } from './view-vehicle/view-vehicle.component';
import {
  alertError,
  alertSuccess,
  alertWarning,
  datePickerToDate,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
import { IPagination } from 'src/app/interfaces/IPagination';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { HttpErrorResponse } from '@angular/common/http';
import { IVehicleData } from 'src/app/interfaces/IVehicleData';
import { VehicleTypeList } from 'src/app/utility/constants/other-constant';
import { SweetAlertResult } from 'sweetalert2';

@UntilDestroy()
@Component({
  selector: 'app-vehicle-management',
  templateUrl: './vehicle-management.component.html',
  styleUrls: ['./vehicle-management.component.scss'],
})
export class VehicleManagementComponent implements OnInit {
  @ViewChild('vehicleModal') protected vehicleModal!: ViewVehicleComponent;

  protected readonly ActionButton = ActionButton;
  protected vehicleList: IVehicleData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected searchForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly vehicleService: VehicleService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadVehicleTableData();
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      inputValue: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  protected onSubmit(): void {
    this.loadVehicleTableData();
  }

  protected onRefresh(): void {
    this.loadVehicleTableData();
  }

  private loadVehicleTableData(): void {
    const { inputValue, fromDate, toDate } = this.searchForm.value;

    let formattedFromDate = null;
    let formattedToDate = null;
    if (fromDate) {
      formattedFromDate = datePickerToDate(fromDate);
    }

    if (toDate) {
      formattedToDate = datePickerToDate(toDate);
    }

    const paginationRequest: IPagination = {
      pageable: true,
      page: this.currentPage - 1,
      size: this.pageSize,
    };

    this.vehicleService
      .getVehicleList(
        paginationRequest,
        inputValue || '',
        formattedFromDate,
        formattedToDate
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.vehicleList = res.body.content.content || [];
            this.count = res.body.content.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.VEHICLE_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.loadVehicleTableData();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadVehicleTableData();
  }

  protected openVehicleView(action: ActionButton, vehicle?: IVehicleData):void {
    this.vehicleModal.loadData();
    this.vehicleModal.action = action;
    this.vehicleModal.vehicle = vehicle;
    this.vehicleModal.visible = true;
  }

  protected onClear(): void {
    this.searchForm.reset();
    this.loadVehicleTableData();
  }

  protected hasAnyValue(): boolean {
    const { inputValue, fromDate, toDate } = this.searchForm.value;

    return !!(inputValue || fromDate || toDate);
  }

  protected getVehicleType(value: string): string | undefined {
    return VehicleTypeList.find(
      (x: Record<string, string>) => x['value'] === value
    )?.['title'];
  }

  protected onDeleteVehicle(id: number): void {
    alertWarning(
      {
        title: RESPONSE_TITLES.WARNING,
        text: RESPONSE_MESSAGES.DELETE_CONFIRMATION,
      },
      (result: SweetAlertResult<any>) => {
        if (result.isConfirmed) {
          this.vehicleService
            .deleteVehicle(id)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                if (res.body.status === RSP_SUCCESS) {
                  this.loadVehicleTableData();
                  alertSuccess({
                    title: RESPONSE_TITLES.DONE,
                    text:
                      res.body.message ||
                      RESPONSE_MESSAGES.VEHICLE_DELETE_SUCCESS,
                  });
                } else {
                  alertError({
                    title: RESPONSE_TITLES.FAILED,
                    text:
                      res.body.message ||
                      RESPONSE_MESSAGES.VEHICLE_DELETE_FAILED,
                  });
                }
              },
              error: (err: HttpErrorResponse) => {
                errorMessageHandler(err);
              },
            });
        }
      }
    );
  }
}
