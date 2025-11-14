import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-route-view',
  templateUrl: './route-view.component.html',
  styleUrls: ['./route-view.component.scss'],
})
export class RouteViewComponent implements OnInit {
  @Input() public route: any;
  public visible: boolean = false;

  protected routeForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    if (this.route) {
      this.routeForm.patchValue(this.route);
    }
  }

  protected createForm(): void {
    this.routeForm = this.fb.group({
      routeName: ['', [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  protected onSubmit(): void {
    console.log(this.routeForm.value);
  }

  protected closeModal(): void {
    this.visible = !this.visible;
  }

  protected changeModalVisibility(event: boolean): void {
    this.visible = event;
  }
}
