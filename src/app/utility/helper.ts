import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ISWALAlert } from '../interfaces/ISWALAlert';
import Swal, { SweetAlertResult } from 'sweetalert2';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { RESPONSE_MESSAGES, RESPONSE_TITLES } from './constants/response-message-title';

export const alertSuccess = async (
  object: ISWALAlert,
  callback?: (result: SweetAlertResult) => void
): Promise<void | SweetAlertResult<any>> => {
  const result = await Swal.fire({
    title: object.title,
    html: object.text,
    icon: 'success',
    reverseButtons: true,
    allowOutsideClick: false,
    showCancelButton: object.showCancelButton ?? false,
    confirmButtonText: object.confirmButtonText ?? 'Okay',
    cancelButtonText: object.cancelButtonText ?? 'Close',
    customClass: {
      popup: 'coreui-popup',
      confirmButton: 'btn btn-success ms-2',
      cancelButton: 'btn btn-secondary',
    },
  });
  if (result && callback) {
    callback(result);
  }
};

export const alertWarning = async (
  object: ISWALAlert,
  callback?: (result: SweetAlertResult) => void
): Promise<void | SweetAlertResult<any>> => {
  const result = await Swal.fire({
    title: object.title,
    text: object.text,
    icon: 'warning',
    reverseButtons: true,
    allowOutsideClick: false,
    showCancelButton: object.showCancelButton ?? true,
    confirmButtonText: object.confirmButtonText ?? 'Yes',
    cancelButtonText: object.cancelButtonText ?? 'No',
    customClass: {
      popup: 'coreui-popup',
      confirmButton: 'btn btn-danger ms-2',
      cancelButton: 'btn btn-secondary',
    },
  });
  if (result && callback) {
    callback(result);
  }
};

export const alertError = async (
  object: ISWALAlert,
  callback?: (result: SweetAlertResult) => void
): Promise<void | SweetAlertResult<any>> => {
  const result = await Swal.fire({
    title: object.title,
    text: object.text,
    icon: 'error',
    reverseButtons: true,
    allowOutsideClick: false,
    showCancelButton: object.showCancelButton ?? false,
    confirmButtonText: object.confirmButtonText ?? 'Try Again',
    cancelButtonText: object.cancelButtonText ?? 'Close',
    customClass: {
      popup: 'coreui-popup',
      confirmButton: 'btn btn-primary ms-2',
      cancelButton: 'btn btn-secondary',
    },
  });
  if (result && callback) {
    callback(result);
  }
};

export const datePickerToDate = (
  date: Date | string | null | undefined,
  format: string = 'YYYY-MM-DD'
): string => {
  if (!date) return '';
  return moment(date).format(format);
};

export const errorMessageHandler = (
  error: HttpErrorResponse,
  title?: string
) => {
  alertError({
    title: title || RESPONSE_TITLES.OOPS,
    text: error.error?.message || RESPONSE_MESSAGES.UNABLE_TO_SERVE_REQUEST_DES,
  });
};

export const onValidate = (formGroup: FormGroup): boolean => {
  formGroup.markAllAsTouched();
  return formGroup.valid;
};

export const passwordMatchValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPasswordControl = group.get('confirmPassword');

  if (!confirmPasswordControl) return null;

  const confirmPassword = confirmPasswordControl.value;

  if (password !== confirmPassword) {
    confirmPasswordControl.setErrors({ passwordMismatch: true });
  } else {
    if (confirmPasswordControl.hasError('passwordMismatch')) {
      confirmPasswordControl.setErrors(null);
    }
  }

  return null;
};
