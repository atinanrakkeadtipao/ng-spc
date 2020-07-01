import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { ControlService, ControlInput, Result, VertifyQuery } from './control';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'xfu-slide-control',
  templateUrl: './slide-control.component.html',
  styleUrls: ['./slide-control.component.css']
})
export class SlideControlComponent implements OnInit {


  @Input() controlInput: ControlInput;
  @Output() successMatch: EventEmitter<VertifyQuery> = new EventEmitter();

  private slider: any;
  private puzzleBefore: any;
  private sliderContainer: any;
  private sliderMask: any;
  private sliderText: any;
  private puzzleBox: any;
  private puzzleBase: any;
  private puzzleMask: any;


  isMouseDown = false;
  private trail: number[] = [];
  private originX: any;
  private originY: any;
  private w: any = 310; // basePuzzle's width
  private h: any = 155; // basePuzzle's height
  private L: any = 62; // puzzle's width

  private pngBase64 = 'data:image/png;base64,';
  private jpgBase64 = 'data:image/jpeg;base64,';

  result: Result;  // api's Result

  constructor(
    private el: ElementRef,
    private controlService: ControlService
  ) {

  }


  ngOnInit() {
    this.slider = this.el.nativeElement.querySelector('.slider');
    this.puzzleBefore = this.el.nativeElement.querySelector('.puzzleBefore');
    this.sliderContainer = this.el.nativeElement.querySelector('.sliderContainer');
    this.sliderMask = this.el.nativeElement.querySelector('.sliderMask');
    this.sliderText = this.el.nativeElement.querySelector('.sliderText');
    this.puzzleBox = this.el.nativeElement.querySelector('.puzzleBox');
    this.puzzleBase = this.el.nativeElement.querySelector('.puzzleBase');
    this.puzzleMask = this.el.nativeElement.querySelector('.puzzleMask');
    this.draw();
    if (this.controlInput.showPuzzle) {
      this.puzzleBox.style.display = 'block';
    }

    this.resetWindow();
    window.onresize = () => {
      this.resetWindow();
    };

  }

  resetWindow() {
    // console.log(this.sliderContainer.offsetLeft);
    this.puzzleBox.style.left = this.sliderContainer.offsetLeft + 1 + 'px';
  }


  touchStart(e: any) {

    this.originX = e.clientX || e.touches[0].clientX;
    this.originY = e.clientY || e.touches[0].clientY;
    this.isMouseDown = true;
    this.puzzleBox.style.display = 'block';
    this.puzzleMask.style.display = 'block';

  }


  touchMove(e: any) {

    // console.log(this.isMouseDown);
    if (!this.isMouseDown) {
      return false;
    }

    const eventX = e.clientX || e.touches[0].clientX;
    const eventY = e.clientY || e.touches[0].clientY;

    const moveX = eventX - this.originX;
    const moveY = eventY - this.originY;
    if (moveX < 0 || moveX + 38 >= this.w) {
      return false;
    }
    this.slider.style.left = moveX + 'px';
    const blockLeft = (this.w - this.L) / (this.w - 40) * moveX;
    this.puzzleBefore.style.left = blockLeft + 'px';
    this.sliderContainer.classList.add('sliderContainer_active');
    this.sliderMask.style.width = moveX + 'px';
    this.trail.push(moveY);

  }

  touchEnd(e: any) {

    // console.log('touchend');
    if (!this.isMouseDown) {
      return false;
    }
    this.isMouseDown = false;

    this.sliderContainer.classList.remove('sliderContainer_active');
    this.puzzleMask.style.display = 'none';

    const eventX = e.clientX || e.changedTouches[0].clientX;
    if (eventX === this.originX) {
      return false;
    }

    const query: VertifyQuery = {move: parseInt(this.puzzleBefore.style.left, 10), action: undefined};
    this.controlService.vertifyAuthImage(this.controlInput.firstConfirmUrl, query)
    .subscribe(
      (data: Result) => {
        this.result = { ...data };
        if (this.result.success) {
          query.action = this.trail;
          this.successMatch.emit(query);
          this.sliderContainer.classList.add('sliderContainer_success');
          this.puzzleBox.style.display = 'none';
        } else {
          this.sliderContainer.classList.add('sliderContainer_fail');
          this.sliderText.innerHTML = 'Try again';
          setTimeout(() => {
            this.reset();
          }, 1000);
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        setTimeout(() => {
          this.reset();
        }, 1000);
      }
    );

  }


  reset() {
    this.slider.style.left = 0;
    this.puzzleBefore.style.left = 0;
    this.sliderMask.style.width = 0;
    this.sliderContainer.className = 'sliderContainer';
    this.trail = [];
    // 重新调用
    this.draw();
  }

  draw() {
    this.controlService.getAuthImage(this.controlInput.genUrl).subscribe((data: Result) => {
      this.result = { ...data };
      if (this.result.success) {
        this.puzzleBase.querySelector('img').src = this.jpgBase64 + this.result.data.bigImage;
        this.puzzleBefore.querySelector('img').src = this.pngBase64 + this.result.data.smallImage;
        this.puzzleBefore.style.top = this.result.data.yheight + 'px';
      } else {
        console.log(this.result);
      }
    },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

}
