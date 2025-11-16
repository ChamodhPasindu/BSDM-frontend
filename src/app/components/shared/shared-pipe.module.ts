import { NgModule } from '@angular/core';
import { EmptyPipe } from 'src/app/utility/pipe/empty.pipe';

@NgModule({
  declarations: [EmptyPipe],
  exports: [EmptyPipe],
})
export class SharedPipeModule {}
