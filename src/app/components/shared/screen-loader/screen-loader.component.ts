import { Component } from '@angular/core';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-screen-loader',
  templateUrl: './screen-loader.component.html',
  styleUrls: ['./screen-loader.component.scss'],
})
export class ScreenLoaderComponent {
  constructor(private loaderService: LoaderService) {}

  public get isLoading(): boolean {
    return this.loaderService.isLoading;
  }
}
