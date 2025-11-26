import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { take } from 'rxjs';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { CommonCode } from 'src/app/enums/CommonCode.enum';
import { IBatch } from 'src/app/interfaces/IBatch';
import { IBatchData } from 'src/app/interfaces/IBatchData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { BatchService } from 'src/app/services/batch/batch.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { UserStatus } from 'src/app/utility/constants/other-constant';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import {
  alertError,
  alertSuccess,
  datePickerToDate,
  dateToDatePicker,
  errorMessageHandler,
  onValidate,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-view-batch',
  templateUrl: './view-batch.component.html',
  styleUrls: ['./view-batch.component.scss'],
})
export class ViewBatchComponent
  extends ModalControlDirective
  implements OnInit
{
  protected readonly ActionButton = ActionButton;

  private _batch: IBatchData | undefined;
  private _action: ActionButton;

  protected batchForm: FormGroup;

  protected statusList: Record<string, string | number>[];

  @Input()
  public set batch(value: IBatchData | undefined) {
    this._batch = value;
    this.updateForm();
  }

  public get batch() {
    return this._batch;
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
    private readonly batchService: BatchService,
    private readonly generalService: GeneralService
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {
    this.batchForm.get('manufactureDate')?.valueChanges.subscribe(() => {
      this.calculateUsableDays();
    });

    this.batchForm.get('expiryDate')?.valueChanges.subscribe(() => {
      this.calculateUsableDays();
    });

    this.loadRoleList();
  }

  private loadRoleList(): void {
    this.generalService
      .getStatusList(CommonCode.BATCH)
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
    this.batchForm = this.fb.group({
      batchCode: ['', Validators.required],
      manufactureDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      usableDays: ['', Validators.required],
      remainingQuantity: [''],
      statusCode: [null, Validators.required],
      warehouseLocation: ['', Validators.required],
    });
    this.setForm(this.batchForm);
  }

  private calculateUsableDays(): void {
    const manufacture = this.batchForm.get('manufactureDate')?.value;
    const expire = this.batchForm.get('expiryDate')?.value;

    if (manufacture && expire) {
      const start = moment(manufacture);
      const end = moment(expire);

      const diffDays = end.diff(start, 'days');

      this.batchForm.get('usableDays')?.setValue(diffDays > 0 ? diffDays : 0);
    }
  }

  private updateForm(): void {
    if (!this.action) return;

    if (this.action === ActionButton.VIEW) {
      this.patchValue();
      this.batchForm.disable();
    }

    if (this.action === ActionButton.EDIT) {
      this.patchValue();
      this.batchForm.enable();
    }

    if (this.action === ActionButton.ADD) {
      this.batchForm.enable();
      this.generateBatchCode();
    }

    this.batchForm.get('usableDays')?.disable();
    this.batchForm.get('batchCode')?.disable();
  }

  private generateBatchCode(): void {
    this.batchService
      .getBatchCode()
      .pipe(untilDestroyed(this), take(1))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.batchForm
              .get('batchCode')
              ?.setValue(res.body.content.batchCode);
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.BATCH_CODE_GENERATE_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private patchValue(): void {
    this.batchForm.patchValue({
      batchCode: this.batch?.batchCode,
      manufactureDate: dateToDatePicker(this.batch?.manufactureDate),
      expiryDate: dateToDatePicker(this.batch?.expiryDate),
      usableDays: this.batch?.usableDays,
      remainingQuantity: this.batch?.remainingQuantity,
      statusCode: this.batch?.statusCode,
      warehouseLocation: this.batch?.warehouseLocation,
    });
  }

  protected onSubmit(): void {
    if (!onValidate(this.batchForm)) return;

    const { manufactureDate, expiryDate } = this.batchForm.value;

    const usableDays = this.batchForm.get('usableDays')?.value;
    const batchCode = this.batchForm.get('batchCode')?.value;

    if (this.action === ActionButton.ADD) {
      this.addBatch({
        ...this.batchForm.value,
        batchCode: batchCode,
        usableDays: usableDays,
        manufactureDate: datePickerToDate(manufactureDate),
        expiryDate: datePickerToDate(expiryDate),
      });
    } else {
      this.updateBatch({
        ...this.batchForm.value,
        batchId: this.batch?.batchId,
        batchCode: batchCode,
        usableDays: usableDays,
        manufactureDate: datePickerToDate(manufactureDate),
        expiryDate: datePickerToDate(expiryDate),
      });
    }
  }

  private addBatch(data: IBatch): void {
    this.batchService
      .addBatch(data)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message || RESPONSE_MESSAGES.BATCH_ADD_EDIT_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.BATCH_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private updateBatch(data: IBatch): void {
    this.batchService
      .updateBatch(data)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message || RESPONSE_MESSAGES.BATCH_ADD_EDIT_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.BATCH_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }
}
