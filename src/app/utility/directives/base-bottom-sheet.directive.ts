import { Directive, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { App } from '@capacitor/app';

@Directive({
  selector: '[appBaseBottomSheet]',
})
export class BaseBottomSheetDirective implements AfterViewInit, OnDestroy {
  public popStateHandler = this.onPopState.bind(this);
  
  @ViewChild('bottomSheetContainer') bottomSheetContainer: ElementRef;
  
  private touchStartY: number = 0;
  private touchCurrentY: number = 0;
  private isDragging: boolean = false;
  private swipeThreshold: number = 100; // pixels to trigger close
  private parentContainer: HTMLElement | null = null;

  constructor(
    public readonly bottomSheetService: NgxBottomSheetService,
  ) {
    // Web back button handling
    history.pushState(null, '');
    window.addEventListener('popstate', this.popStateHandler);

    // Mobile hardware back button
    App.addListener('backButton', () => {
      this.bottomSheetService.close();
    });
  }

  ngAfterViewInit(): void {
    // Initialize swipe gesture handling
    this.initializeSwipeGestures();
  }

  private initializeSwipeGestures(): void {
    // Get the parent ngx-bottom-sheet-container
    if (this.bottomSheetContainer) {
      const element = this.bottomSheetContainer.nativeElement;
      // Try multiple selectors to find the actual container
      this.parentContainer = 
        element.closest('.ngx-bottom-sheet-container') || 
        element.closest('.ngx-bottom-sheet') ||
        element.parentElement?.closest('[role="dialog"]') ||
        element.parentElement?.parentElement;
      
      if (this.parentContainer) {
        this.parentContainer.style.overflow = 'visible';
      } else {
        // Fallback to the element itself
        this.parentContainer = element;
      }
    }
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
    this.isDragging = true;
  }

  protected onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    
    this.touchCurrentY = event.touches[0].clientY;
    const dragDistance = this.touchCurrentY - this.touchStartY;
    
    // Only allow downward drag
    if (dragDistance > 0 && this.parentContainer) {
      // Remove transition during drag for smooth following
      this.parentContainer.style.transition = 'none';
      this.parentContainer.style.transform = `translateY(${dragDistance}px)`;
    }
  }

  protected onTouchEnd(event: TouchEvent): void {
    this.isDragging = false;
    const dragDistance = this.touchCurrentY - this.touchStartY;
    
    if (this.parentContainer) {
      // If dragged beyond threshold, close the sheet
      if (dragDistance > this.swipeThreshold) {
        this.parentContainer.style.transition = 'transform 0.3s ease-out';
        this.parentContainer.style.transform = 'translateY(100%)';
        
        // Close after animation completes
        setTimeout(() => {
          this.bottomSheetService.close();
        }, 300);
      } else {
        // Snap back to original position
        this.parentContainer.style.transition = 'transform 0.2s ease-out';
        this.parentContainer.style.transform = 'translateY(0)';
        setTimeout(() => {
          this.parentContainer!.style.transition = 'none';
        }, 200);
      }
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.popStateHandler);
  }

  public onPopState(): void {
    this.bottomSheetService.close();
  }
}
