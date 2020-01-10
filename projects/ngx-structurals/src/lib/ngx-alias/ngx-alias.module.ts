import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAliasDirective } from './ngx-alias.directive';

@NgModule({
    declarations: [NgxAliasDirective],
    exports: [NgxAliasDirective],
    imports: [
        CommonModule
    ]
})
export class NgxAliasModule {
}
