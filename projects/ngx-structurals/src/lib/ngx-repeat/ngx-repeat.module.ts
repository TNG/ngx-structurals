import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxRepeatDirective } from './ngx-repeat.directive';

@NgModule({
    declarations: [NgxRepeatDirective],
    exports: [NgxRepeatDirective],
    imports: [
        CommonModule
    ]
})
export class NgxRepeatModule {
}
