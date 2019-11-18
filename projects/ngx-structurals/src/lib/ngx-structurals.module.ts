import { NgModule } from '@angular/core';
import { NgxSubscribeModule } from './ngx-subscribe/ngx-subscribe.module';
import { NgxRepeatModule } from './ngx-repeat/ngx-repeat.module';
import { NgxAliasModule } from './ngx-alias/ngx-alias.module';

@NgModule({
    imports: [
        NgxSubscribeModule,
        NgxRepeatModule,
        NgxAliasModule,
    ],
    exports: [
        NgxSubscribeModule,
        NgxRepeatModule,
        NgxAliasModule,
    ],
})
export class NgxStructuralsModule {
}
