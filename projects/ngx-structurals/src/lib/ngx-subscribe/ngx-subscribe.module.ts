import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSubscribeDirective } from './ngx-subscribe.directive';

@NgModule({
    declarations: [NgxSubscribeDirective],
    exports: [NgxSubscribeDirective],
    imports: [
        CommonModule,
    ]
})
export class NgxSubscribeModule {
}
