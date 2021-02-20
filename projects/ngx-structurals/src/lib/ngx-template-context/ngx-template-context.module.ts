import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxTemplateContextDirective } from './ngx-template-context.directive';

@NgModule({
    declarations: [NgxTemplateContextDirective],
    exports: [NgxTemplateContextDirective],
    imports: [
        CommonModule
    ]
})
export class NgxTemplateContextModule {
}
