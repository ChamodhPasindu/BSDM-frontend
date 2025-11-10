import { NgModule } from '@angular/core';
import { ValidateDirective } from 'src/app/utility/directives/validate.directive';

@NgModule({
  declarations: [ValidateDirective],
  exports: [ValidateDirective]
})
export class SharedDirectiveModule { }
