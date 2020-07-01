# ng-spc

ng-spc is an [Angular](https://github.com/angular/angular-cli) component for Sliding puzzle captcha

## Examples

https://www.xfunction.cn/tools/questionnaire-public/2

![](https://www.xfunction.cn/statics/images/spc/spc.png)

## Installation

`npm install ng-spc`

## Usage

Sliding puzzle CapTCHA (SPC) actually requires the use of both sides of the Web and API. The Web side is `ng-spc`. API related will be explained later.

```
<xfu-slide-control [controlInput]="controlInput" (successMatch)="successMatch($event)">
</xfu-slide-control>
```
* @Input() controlInput: ControlInput;

ControlInput Control initialization configuration parameters required

>> - genUrl?: string, 'GET' the API for 'Result' to get the puzzle base and the puzzle.
>> - firstConfirmUrl?: string, 'POST' VertifyQuery for 'Reseult' from the API for the first validation result.
>> - showPuzzle?: boolean, whether to display the puzzle directly.

```
export interface Result {
    success: boolean;
    code: string;
    msg: string;
    errorMsg: string;
    data: any;
}

export interface VertifyQuery {
    move: number;
    action: number[];
}
```
For example for Result:

genUrl's success: `{"success":true,"code":"200","msg":"OK","data":{"smallImage":"l73BiODIWNwLnrBEwgU8YpiI.....","bigImage":"/9j/4AAQSkZJRgABAgAAAQABAADQ==....","yheight":6,"xwidth":0}} `  
firstConfirmUrl's success: `{"success":true,"code":"200","msg":"OK","data":{}}`



* @Output() successMatch: EventEmitter<VertifyQuery> = new EventEmitter(); 

Return the result of the successful jigsaw puzzle, which is suggested to be sent to the back end with the business data for second confirmation.

## Recommended Usage

```
// 

import { Component, ViewChild, OnInit } from '@angular/core';
import { SlideControlComponent } from 'ng-spc';
import { ControlInput, VertifyQuery} from 'ng-spc';

@Component({
  selector: 'app-root',
  template: `<div style="height: 200px;background-color: aquamarine;"></div>
<xfu-slide-control [controlInput]="controlInput" (successMatch)="successMatch($event)" style="text-align:-webkit-center"></xfu-slide-control>`,
  styles: []
})
export class AppComponent implements OnInit{

  title = 'test-ng-spc';
  @ViewChild(SlideControlComponent, {static: true})
  slide: SlideControlComponent;

  public controlInput: ControlInput;

  private query: VertifyQuery;


  ngOnInit() {
    this.controlInput = new ControlInput(
      'https://api.xfunction.cn/slide/get',
      'https://api.xfunction.cn/slide/vertify',
      false
    );
  }

  private reset() {
    this.query.move = undefined;
    this.query.action = [];
    this.slide.reset();
  }

  successMatch( query: VertifyQuery) {   
    console.log(query);
    this.query = query;
  }
}

```

## API 

API's project see here(https://github.com/KelvinDong/xfunction-api).

The project is quite extensive, but only the following documents are relevant
* Interface class, genUrl [GET] and firstConfirmUrl[POST] used by the front end:

https://github.com/KelvinDong/xfunction-api/blob/master/src/main/java/net/xfunction/java/api/modules/user/controller/SlideController.java
* Tool class for generating jigsaw base and puzzle pieces

https://github.com/KelvinDong/xfunction-api/blob/master/src/main/java/net/xfunction/java/api/core/utils/PuzzleUtils.java

* The entity class that returns the result

https://github.com/KelvinDong/xfunction-api/blob/master/src/main/java/net/xfunction/java/api/core/utils/Result.java

* Returns the `data` entity class in Result

https://github.com/KelvinDong/xfunction-api/blob/master/src/main/java/net/xfunction/java/api/core/pojo/Slide.java


