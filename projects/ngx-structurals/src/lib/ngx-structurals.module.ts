import { NgModule } from '@angular/core';
import { NgxSubscribeModule } from './ngx-subscribe/ngx-subscribe.module';
import { NgxRepeatModule } from './ngx-repeat/ngx-repeat.module';

@NgModule({
    imports: [
        NgxSubscribeModule,
        NgxRepeatModule,
    ],
    exports: [
        NgxSubscribeModule,
        NgxRepeatModule,
    ],
})
export class NgxStructuralsModule {
}
