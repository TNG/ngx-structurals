import { Directive, Input, OnInit, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

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
    // tslint:disable-next-line: no-non-null-assertion justification https://github.com/angular/vscode-ng-language-service/issues/1137
    public ngxAlias: T = null!;

    /**
     * Synonym for {@link ngxAlias}.
     *
     * @publicApi
     */
    public get $implicit(): T {
        return this.ngxAlias;
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
export class NgxAliasDirective<T> implements OnInit {

    private readonly context = new NgxAliasContext();

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

    public ngOnInit(): void {
        this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }

    /**
     * Expression to alias.
     *
     * @publicApi
     */
    @Input()
    public set ngxAlias(expression: T) {
        this.context.ngxAlias = expression;
    }

}
