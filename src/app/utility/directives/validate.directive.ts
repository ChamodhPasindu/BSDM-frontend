import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  Optional,
} from '@angular/core';
import { FormGroupDirective, NgControl } from '@angular/forms';
import { Subscription, merge } from 'rxjs';
@Directive({
  selector: '[appValidate]',
})
export class ValidateDirective implements OnInit, OnDestroy {
  @Input() fieldName: string = 'This field';

  private feedbackEl?: HTMLElement;
  private sub?: Subscription;

  constructor(
    private control: NgControl,
    private el: ElementRef,
    private renderer: Renderer2,
    @Optional() private formGroupDir: FormGroupDirective
  ) {}

  ngOnInit(): void {
    this.createFeedbackElement();

    const control = this.control.control;
    if (!control) return;

    // Merge statusChanges and valueChanges
    this.sub = merge(control.statusChanges!, control.valueChanges!).subscribe(
      () => this.updateValidationState()
    );

    // Blur event
    this.renderer.listen(this.el.nativeElement, 'blur', () => {
      this.updateValidationState();
    });

    // Input event: mark as touched and validate on each keystroke
    this.renderer.listen(this.el.nativeElement, 'input', () => {
      if (!control.touched) {
        control.markAsTouched(); // mark as touched on first input
      }
      this.updateValidationState();
    });

    // Subscribe to form submit if available
    if (this.formGroupDir) {
      this.formGroupDir.ngSubmit.subscribe(() => {
        this.updateValidationState(true); // indicate form submission
      });
    }

    // Initial update
    this.updateValidationState();
  }

  private createFeedbackElement() {
    const inputEl = this.el.nativeElement as HTMLElement;
    const parent = inputEl.parentElement;
    if (!parent) return;

    this.feedbackEl = this.renderer.createElement('c-form-feedback');
    this.renderer.setStyle(this.feedbackEl, 'display', 'block');
    this.renderer.appendChild(parent, this.feedbackEl);
  }

  private updateValidationState(formSubmitted: boolean = false) {
    const control = this.control.control;
    const inputEl = this.el.nativeElement as HTMLElement;

    if (!control || !this.feedbackEl) return;

    const invalid = control.invalid && (control.touched || formSubmitted);

    // Add/remove is-invalid class on input
    if (invalid) {
      this.renderer.addClass(inputEl, 'is-invalid');
      this.renderer.removeClass(inputEl, 'is-valid');
      // } else if (control.valid && (control.touched || formSubmitted)) {
      // this.renderer.addClass(inputEl, 'is-valid');
      // this.renderer.removeClass(inputEl, 'is-invalid');
    } else {
      this.renderer.removeClass(inputEl, 'is-invalid');
      this.renderer.removeClass(inputEl, 'is-valid');
    }

    // Feedback element class and text
    this.renderer.setAttribute(this.feedbackEl, 'valid', (!invalid).toString());
    this.renderer.removeClass(this.feedbackEl, 'invalid-feedback');
    this.renderer.removeClass(this.feedbackEl, 'valid-feedback');
    if (invalid) this.renderer.addClass(this.feedbackEl, 'invalid-feedback');
    else if (control.valid && (control.touched || formSubmitted))
      this.renderer.addClass(this.feedbackEl, 'valid-feedback');

    // Error text
    this.feedbackEl.innerHTML = '';
    if (invalid) {
      const div = this.renderer.createElement('div');
      const text = this.renderer.createText(
        this.getErrorMessage(control.errors)
      );
      this.renderer.appendChild(div, text);
      this.renderer.appendChild(this.feedbackEl, div);
    }
  }

  private getErrorMessage(errors: any): string {
    if (!errors) return '';
    if (errors['required']) return `${this.fieldName} is required`;
    if (errors['email']) return 'Invalid email format';
    if (errors['minlength'])
      return `${this.fieldName} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength'])
      return `${this.fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    return `Invalid ${this.fieldName}`;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
