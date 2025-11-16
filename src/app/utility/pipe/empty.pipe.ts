import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'empty',
})
export class EmptyPipe implements PipeTransform {
  transform(value: any, fallback: string = '-'): string {
    return value !== null && value !== undefined && value !== ''
      ? String(value)
      : fallback;
  }
}
