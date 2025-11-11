import { FormGroup } from '@angular/forms';
import { ISWALAlert } from '../interfaces/ISWALAlert';
import Swal, { SweetAlertResult } from 'sweetalert2';

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

export const onValidate = (formGroup: FormGroup): boolean => {
  formGroup.markAllAsTouched();
  return formGroup.valid;
};
