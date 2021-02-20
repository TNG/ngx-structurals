import { Directive, Input } from '@angular/core';

/**
 * Defines the template context
 *
 * You can use [ngxTemplateContext] to specify the the template context inside a ng-template tag body
 * by providing a variable with the desired type.
 *
 * @publicApi
 */
@Directive({
    selector: '[ngxTemplateContext]'
})
export class NgxTemplateContextDirective<T> {
    /**
     * Variable defining the Template Context
     *
     * @publicApi
     */
    @Input()
    ngxTemplateContext?: T;

    /** @internal */
    static ngTemplateContextGuard<T>(
        dir: NgxTemplateContextDirective<T>,
        ctx: unknown
    ): ctx is T {
        return true;
    }
}
