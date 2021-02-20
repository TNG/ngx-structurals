import { NgModule } from '@angular/core';
import { NgxSubscribeModule } from './ngx-subscribe/ngx-subscribe.module';
import { NgxRepeatModule } from './ngx-repeat/ngx-repeat.module';
import { NgxAliasModule } from './ngx-alias/ngx-alias.module';
import { NgxTemplateContextModule } from './ngx-template-context/ngx-template-context.module';

@NgModule({
    imports: [
        NgxSubscribeModule,
        NgxRepeatModule,
        NgxAliasModule,
        NgxTemplateContextModule,
    ],
    exports: [
        NgxSubscribeModule,
        NgxRepeatModule,
        NgxAliasModule,
        NgxTemplateContextModule,
    ],
})
export class NgxStructuralsModule {
}
