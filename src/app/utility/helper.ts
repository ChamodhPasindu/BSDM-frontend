import { FormGroup } from "@angular/forms";

export const onValidate = (
    formGroup: FormGroup,
  ): boolean => {
    formGroup.markAllAsTouched();
    return formGroup.valid;
  };