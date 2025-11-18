import { NgModule } from '@angular/core';
import { NumberSeparatePipe } from 'src/app/utility/pipe/NumberSeparatePipe.pipe';
import { EmptyPipe } from 'src/app/utility/pipe/empty.pipe';

@NgModule({
  declarations: [EmptyPipe,NumberSeparatePipe],
  exports: [EmptyPipe,NumberSeparatePipe],
})
export class SharedPipeModule {}
