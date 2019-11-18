import { Directive, Input, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * Context provided when using the [ngxAlias] directive.
 *
 * @publicApi
 */
export class NgxAliasContext<T> {
    /**
     * Value of the aliased expression.
     *
     * This simply mirrors the value of the expression given to ngxAlias.
     *
     * @publicApi
     */
    public ngxAlias: T;

    /** @internal */
    constructor(ngxAlias: T) {
        this.ngxAlias = ngxAlias;
    }
}

/**
 * Aliases an expression for a template.
 *
 * You can use [ngxAlias] to unconditionally render a given template, but aliasing a potentially complex expression to a simpler
 * template input variable. The template will always be rendered, even if the value of the expression is falsy.
 *
 * @publicApi
 */
@Directive({
    selector: '[ngxAlias]',
})
export class NgxAliasDirective<T> {

    private expression?: T;

    constructor(
        private readonly viewContainer: ViewContainerRef,
        @Optional() private readonly templateRef: TemplateRef<unknown>,
    ) {
        if (!this.templateRef) {
            throw new Error(`[ngxAlias] can only be used as a structural directive or on an ng-template.`);
        }
    }

    /** @internal */
    public static ngTemplateContextGuard<T>(dir: NgxAliasDirective<T>, ctx: unknown): ctx is NgxAliasContext<T> {
        return true;
    }

    /**
     * Expression to alias.
     *
     * @publicApi
     */
    @Input()
    public set ngxAlias(expression: T) {
        if (expression !== this.expression) {
            this.expression = expression;
            this.updateView();
        }
    }

    private updateView(): void {
        this.viewContainer.clear();

        this.viewContainer.createEmbeddedView(this.templateRef, new NgxAliasContext(this.expression));
    }

}
