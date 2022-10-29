import { Component, HostListener, Input, OnInit } from '@angular/core';

interface Item {
  imageSrc: string;
  imageAlt: string;
}

@Component({
  selector: 'app-gallery-lightbox',
  templateUrl: './gallery-lightbox.component.html',
  styleUrls: ['./gallery-lightbox.component.scss']
})
export class GalleryLightboxComponent implements OnInit {
  @Input() galleryData: Item[] = [];
  @Input() showCount = false;

  defaultTouch = { x: 0, y: 0, time: 0 };

  previewImage = false;
  showMask = false;
  currentLightboxImage: Item = this.galleryData[0];
  currentIndex = 0;
  controls = true;
  totalImageCount = 0;

  @HostListener('document:keydown', ['$event.key'])
  handleKey($event: string): void {
    if ($event === 'Escape' && this.showMask === true) {
      this.onClosePreview();
    } else if ($event === 'ArrowRight' && this.showMask === true) {
      this.next();
    } else if ($event === 'ArrowLeft' && this.showMask === true) {
      this.prev();
    }
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  handleTouch(event: TouchEvent) {
    let touch = event.touches[0] || event.changedTouches[0];

    if (event.type === 'touchstart') {
      this.defaultTouch.x = touch.pageX;
      this.defaultTouch.y = touch.pageY;
      this.defaultTouch.time = event.timeStamp;
    } else if (event.type === 'touchend') {
      let deltaX = touch.pageX - this.defaultTouch.x;
      let deltaY = touch.pageY - this.defaultTouch.y;
      let deltaTime = event.timeStamp - this.defaultTouch.time;

      // simulte a swipe -> less than 500 ms and more than 60 px
      if (deltaTime < 500) {
          // touch movement lasted less than 500 ms
          if (Math.abs(deltaX) > 60 && this.showMask == true) {
              // delta x is at least 60 pixels
            if (deltaX > 0) {
                this.prev()
              } else {
                this.next()
              }
          }
      }
    }
  }

  doSwipeLeft(event: any) {
    console.log('swipe left', event);
  }

  doSwipeRight(event: any) {
    console.log('swipe right', event);
  }

  doSwipeUp(event: any) {
    console.log('swipe up', event);
  }

  doSwipeDown(event: any) {
    console.log('swipe down', event);
  }

  constructor() { }

  ngOnInit(): void {
    this.totalImageCount = this.galleryData.length;
  }

  onPreviewImage(index: number): void {
    this.showMask = true;
    this.previewImage = true;
    this.currentIndex = index;
    this.currentLightboxImage = this.galleryData[index];
    document.body.style.overflow = 'hidden';
  }

  onClosePreview() {
    this.previewImage = false;
    this.showMask = false;
    document.body.style.overflow = 'auto';
  }

  next(): void {
    this.currentIndex = this.currentIndex + 1;
    if (this.currentIndex > this.galleryData.length - 1) {
      this.currentIndex = 0;
    }
    this.currentLightboxImage = this.galleryData[this.currentIndex];
  }

  prev(): void {
    this.currentIndex = this.currentIndex - 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.galleryData.length - 1;
    }
    this.currentLightboxImage = this.galleryData[this.currentIndex];
  }

}
