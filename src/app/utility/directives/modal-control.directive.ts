import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appModalControl]',
})
export class ModalControlDirective {
  public visible: boolean = false;
  protected formGroup?: FormGroup;

  constructor() {}

  protected setForm(form: FormGroup): void {
    this.formGroup = form;
  }

  public onCloseModal(): void {
    this.visible = !this.visible;
  }

  public onChangeModalVisibility(event: boolean): void {
    this.visible = event;
    if (!event && this.formGroup) {
      this.formGroup.reset();
    }
  }
}
