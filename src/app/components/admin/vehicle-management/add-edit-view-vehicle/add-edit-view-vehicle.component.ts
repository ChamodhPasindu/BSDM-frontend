import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { CommonCode } from 'src/app/enums/CommonCode.enum';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IVehicle } from 'src/app/interfaces/IVehicle';
import { IVehicleData } from 'src/app/interfaces/IVehicleData';
import { GeneralService } from 'src/app/services/general/general.service';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
import { VehicleTypeList } from 'src/app/utility/constants/other-constant';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import {
  alertError,
  alertSuccess,
  errorMessageHandler,
  onValidate,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-add-edit-view-vehicle',
  templateUrl: './add-edit-view-vehicle.component.html',
  styleUrls: ['./add-edit-view-vehicle.component.scss'],
})
export class AddEditViewVehicleComponent
  extends ModalControlDirective
  implements OnInit
{
  protected readonly ActionButton = ActionButton;

  private _vehicle: IVehicleData | undefined;
  private _action: ActionButton;

  protected vehicleForm: FormGroup;

  protected statusList: Record<string, string | number>[];
  protected vehicleTypeList: Record<string, string>[] = VehicleTypeList;

  @Input()
  public set vehicle(value: IVehicleData | undefined) {
    this._vehicle = value;
    this.updateForm();
  }

  public get vehicle() {
    return this._vehicle;
  }

  @Input()
  public set action(value: ActionButton) {
    this._action = value;
  }

  public get action() {
    return this._action;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly vehicleService: VehicleService,
    private readonly generalService: GeneralService
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  protected override resetState(): void {}

  public loadData(): void {
    this.generalService
      .getStatusList(CommonCode.VEHICLE)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.statusList = res.body.content.dropdown;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.COMMON_ERROR_DES,
            });
          }
        },
        error: (err: HttpErrorResponse) => errorMessageHandler(err),
      });
  }

  private createForm(): void {
    this.vehicleForm = this.fb.group({
      vehicleNumber: ['', Validators.required],
      vehicleCode: [null, Validators.required],
      statusCode: [null, Validators.required],
    });
    this.setForm(this.vehicleForm);
  }

  private updateForm(): void {
    if (!this.action) return;

    if (this.action === ActionButton.VIEW) {
      this.patchValue();
      this.vehicleForm.disable();
    }

    if (this.action === ActionButton.EDIT) {
      this.patchValue();
      this.vehicleForm.enable();
    }

    if (this.action === ActionButton.ADD) {
      this.vehicleForm.enable();
    }
  }

  private patchValue(): void {
    this.vehicleForm.patchValue({
      vehicleNumber: this.vehicle?.vehicleNumber,
      vehicleCode: this.vehicle?.vehicleCode.split('-')[0],
      statusCode: this.vehicle?.statusCode,
    });
  }

  protected onSubmit(): void {
    if (!onValidate(this.vehicleForm)) return;

    const { vehicleCode } = this.vehicleForm.value;
    const timestamp = Date.now();
    const updatedVehicleCode = `${vehicleCode}-${timestamp}`;

    if (this.action === ActionButton.ADD) {
      this.addVehicle({
        ...this.vehicleForm.value,
        vehicleCode: updatedVehicleCode,
      });
    } else {
      this.updateVehicle({
        ...this.vehicleForm.value,
        vehicleId: this.vehicle?.vehicleId,
        vehicleCode: updatedVehicleCode,
      });
    }
  }

  private addVehicle(data: IVehicle): void {
    this.vehicleService
      .addVehicle(data)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message || RESPONSE_MESSAGES.VEHICLE_ADD_EDIT_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.VEHICLE_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private updateVehicle(data: IVehicle): void {
    this.vehicleService
      .updateVehicle(data)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message || RESPONSE_MESSAGES.VEHICLE_ADD_EDIT_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.VEHICLE_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }
}
