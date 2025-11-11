import { NgModule } from '@angular/core';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalHeaderComponent,
  ModalTitleDirective,
  PageItemDirective,
  PageLinkDirective,
  TemplateIdDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ValidateDirective } from 'src/app/utility/directives/validate.directive';

@NgModule({
  imports: [
    IconDirective,
    TemplateIdDirective,
    ModalHeaderComponent,
    ModalTitleDirective,
    ButtonCloseDirective,
    PageItemDirective,
    PageLinkDirective,
    ButtonDirective,
  ],
  declarations: [ValidateDirective],
  exports: [
    ValidateDirective,
    IconDirective,
    TemplateIdDirective,
    ModalHeaderComponent,
    ModalTitleDirective,
    ButtonCloseDirective,
    PageItemDirective,
    PageLinkDirective,
    ButtonDirective,
  ],
})
export class SharedDirectiveModule {}
