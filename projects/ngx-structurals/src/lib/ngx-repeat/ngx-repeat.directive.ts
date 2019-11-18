import { Directive, EmbeddedViewRef, Input, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * Context provided when using the [ngxRepeat] directive.
 *
 * @publicApi
 */
export class NgxRepeatContext {
    /**
     * Index of the current template.
     *
     * This holds the index of the n-th template being currently rendered, i.e., if the template is repeated three times, this value
     * is in the range 0–2.
     *
     * @publicApi
     */
    public $implicit = 0;
    /**
     * Total number of repetitions.
     *
     * Represents the count given to the directive, i.e. how many instances of the template will be rendered.
     */
    public count = 0;

    /**
     * Whether the current index is even.
     *
     * Whether the current index as described in {@link $implicit} is an even number.
     *
     * @publicApi
     */
    public get even(): boolean {
        return this.$implicit % 2 === 0;
    }

    /**
     * Whether the current index is odd.
     *
     * Whether the current index as described in {@link $implicit} is an odd number.
     *
     * @publicApi
     */
    public get odd(): boolean {
        return this.$implicit % 2 !== 0;
    }

    /**
     * Whether this template instance is the first one.
     *
     * This is {@code true} only for the first template instance rendered.
     *
     * @publicApi
     */
    public get first(): boolean {
        return this.$implicit === 0;
    }

    /**
     * Whether this template instance is the last one.
     *
     * This is {@code true} only for the last template instance rendered.
     *
     * @publicApi
     */
    public get last(): boolean {
        return this.$implicit + 1 === this.count;
    }
}

/**
 * Repeats a template a given number of times.
 *
 * You can use [ngxRepeat] to render a template a specific number of times. This is similar to using {@code *ngFor} on an array of that
 * length, but avoids having to create such an array. The directive also exposes similar and useful context properties, see
 * {@link NgxRepeatContext}.
 *
 * @publicApi
 */
@Directive({
    selector: '[ngxRepeat]',
})
export class NgxRepeatDirective {

    constructor(
        private readonly viewContainer: ViewContainerRef,
        @Optional() private readonly templateRef: TemplateRef<NgxRepeatContext>,
    ) {
        if (!this.templateRef) {
            throw new Error(`[ngxRepeat] can only be used as a structural directive or on an ng-template.`);
        }
    }

    /**
     * Defines how often the template should be rendered.
     *
     * @publicApi
     */
    @Input()
    public set ngxRepeat(count: number) {
        this.updateView(Number(count));
    }

    private updateView(count: number): void {
        const current = this.viewContainer.length;
        if (current === count) {
            return;
        }

        for (let j = 0; j < current; j++) {
            const viewRef = this.viewContainer.get(j) as EmbeddedViewRef<NgxRepeatContext>;
            viewRef.context.count = count;
        }

        if (current > count) {
            for (let i = count; i < current; i++) {
                this.viewContainer.remove(i);
            }
        } else {
            for (let i = current; i < count; i++) {
                const context = new NgxRepeatContext();
                context.$implicit = i;
                context.count = count;

                this.viewContainer.createEmbeddedView(this.templateRef, context);
            }
        }
    }

}
