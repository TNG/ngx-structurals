import { NgModule } from '@angular/core';
import { NgxSubscribeModule } from './ngx-subscribe/ngx-subscribe.module';

@NgModule({
    imports: [
        NgxSubscribeModule,
    ],
    exports: [
        NgxSubscribeModule,
    ],
})
export class NgxStructuralsModule {
}
