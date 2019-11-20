import { Directive, EmbeddedViewRef, Input, OnDestroy, Optional, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

/**
 * Context provided when using the [ngxSubscribe] directive.
 *
 * @publicApi
 */
export class NgxSubscribeContext<T> {
    /**
     * The (most recently) emitted value of the bound observable.
     *
     * This always keeps the last emitted value of the bound observable and is {@code null} if the observable has not yet emitted.
     * To distinguish an emitted {@code null} value from this, use the {@link count} context variable.
     *
     * @publicApi
     */
    public $implicit: T | null = null;
    /**
     * Whether the bound observable has errored.
     *
     * This is {@code true} if and only if the currently bound observable has errored. You can access the error using {@link error}.
     *
     * @publicApi
     */
    public errored = false;
    /**
     * Whether the bound observable has completed.
     *
     * This is {@code true} if and only if the currently bound observable has completed.
     *
     * @publicApi
     */
    public completed = false;
    /**
     * Error thrown by the observable.
     *
     * Holds the error thrown by the observable if it has indeed errored. This can be checked using the {@link errored} context member.
     * Otherwise this holds the value {@code null}.
     *
     * @publicApi
     */
    public error: any | null = null;
    /**
     * Number of emitted values.
     *
     * This counter increases any time the currently bound observable emits a value.
     *
     * @publicApi
     */
    public count = 0;
}

/**
 * Subscribes to a given observable and renders a template.
 *
 * You can use the [ngxSubscribe] structural directive to subscribe to an observable directly from the template of your Angular component.
 * Using the provided context information you have access to all important information. You can also define different templates to be
 * rendered depending on whether the observable has (not yet) emitted, errored or completed.
 *
 * @publicApi
 */
@Directive({
    selector: '[ngxSubscribe]',
})
export class NgxSubscribeDirective<T> implements OnDestroy {

    private context = new NgxSubscribeContext<T>();

    private thenTemplateRef: TemplateRef<NgxSubscribeContext<T>> | null = null;
    private thenViewRef: EmbeddedViewRef<NgxSubscribeContext<T>> | null = null;
    private beforeAnyTemplate: TemplateRef<NgxSubscribeContext<T>> | null = null;
    private beforeAnyViewRef: EmbeddedViewRef<NgxSubscribeContext<T>> | null = null;
    private onErrorTemplateRef: TemplateRef<NgxSubscribeContext<T>> | null = null;
    private onErrorViewRef: EmbeddedViewRef<NgxSubscribeContext<T>> | null = null;
    private onCompletedTemplateRef: TemplateRef<NgxSubscribeContext<T>> | null = null;
    private onCompletedViewRef: EmbeddedViewRef<NgxSubscribeContext<T>> | null = null;

    private source$: Observable<T> | null = null;
    private subscription: Subscription | null = null;

    constructor(
        private readonly viewContainer: ViewContainerRef,
        @Optional() templateRef: TemplateRef<NgxSubscribeContext<T>>,
    ) {
        if (!templateRef) {
            throw new Error(`[ngxSubscribe] can only be used as a structural directive or on an ng-template.`);
        }

        this.thenTemplateRef = templateRef;
        this.beforeAnyTemplate = templateRef;
        this.onErrorTemplateRef = templateRef;
        this.onCompletedTemplateRef = templateRef;
    }

    /** @internal */
    public static ngTemplateContextGuard<T>(dir: NgxSubscribeDirective<T>, ctx: unknown): ctx is NgxSubscribeContext<T> {
        return true;
    }

    /**
     * See {@link NgxSubscribeDirective#ngxSubscribeOf}.
     *
     * @publicApi
     */
    @Input()
    public set ngxSubscribe(source$: Observable<T>) {
        this.ngxSubscribeOf = source$;
    }

    /**
     * Observable to subscribe to.
     *
     * This is the primary input for the {@code [ngxSubscribe]} directive and defines the observable which should be subscribed to.
     *
     * @publicApi
     */
    @Input()
    public set ngxSubscribeOf(source$: Observable<T>) {
        if (this.source$ === source$) {
            return;
        }

        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;

            this.context = new NgxSubscribeContext<T>();
            this.clearViewRefs();
        }

        if (source$) {
            this.subscription = source$.subscribe({
                next: value => {
                    this.context.$implicit = value;
                    this.context.count++;
                    this.updateView();
                },
                error: err => {
                    this.context.errored = true;
                    this.context.error = err;
                    this.updateView();
                },
                complete: () => {
                    this.context.completed = true;
                    this.updateView();
                },
            });
        }

        this.updateView();
    }

    /**
     * Template to show for emitted values.
     *
     * Defines the template to be shown when the observable emits a value.
     *
     * @publicApi
     */
    @Input()
    public set ngxSubscribeThen(templateRef: TemplateRef<NgxSubscribeContext<T>> | null) {
        this.thenTemplateRef = templateRef;
        this.thenViewRef = null;
        this.updateView();
    }

    /**
     * Template to show while observable has not emitted, errored or completed.
     *
     * Defines the template to be shown before the observable has either emitted a value, errored or completed.
     * If not specified, this defaults to the template on which the directive has been applied.
     *
     * @publicApi
     */
    @Input()
    public set ngxSubscribeBeforeAny(templateRef: TemplateRef<NgxSubscribeContext<T>> | null) {
        this.beforeAnyTemplate = templateRef;
        this.beforeAnyViewRef = null;
        this.updateView();
    }

    /**
     * Template to show if the observable errored.
     *
     * Defines the template to be shown in case the observable has errored.
     * If not specified, this defaults to the template on which the directive has been applied.
     *
     * @publicApi
     */
    @Input()
    public set ngxSubscribeOnError(templateRef: TemplateRef<NgxSubscribeContext<T>> | null) {
        this.onErrorTemplateRef = templateRef;
        this.onErrorViewRef = null;
        this.updateView();
    }

    /**
     * Template to show if the observable completed.
     *
     * Defines the template to be shown in case the observable completed.
     * If not specified, this defaults to the template on which the directive has been applied.
     *
     * @publicApi
     */
    @Input()
    public set ngxSubscribeOnCompleted(templateRef: TemplateRef<NgxSubscribeContext<T>> | null) {
        this.onCompletedTemplateRef = templateRef;
        this.onCompletedViewRef = null;
        this.updateView();
    }

    /** @internal */
    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private updateView(): void {
        if (this.context.completed) {
            if (!this.onCompletedViewRef) {
                this.clearViewRefs();
                if (this.onCompletedTemplateRef) {
                    this.onCompletedViewRef = this.viewContainer.createEmbeddedView(this.onCompletedTemplateRef, this.context);
                }
            }
        } else if (this.context.errored) {
            if (!this.onErrorViewRef) {
                this.clearViewRefs();
                if (this.onErrorTemplateRef) {
                    this.onErrorViewRef = this.viewContainer.createEmbeddedView(this.onErrorTemplateRef, this.context);
                }
            }
        } else if (this.context.count === 0) {
            if (!this.thenViewRef) {
                this.clearViewRefs();
                if (this.beforeAnyTemplate) {
                    this.beforeAnyViewRef = this.viewContainer.createEmbeddedView(this.beforeAnyTemplate, this.context);
                }
            }
        } else {
            if (!this.thenViewRef) {
                this.clearViewRefs();
                if (this.thenTemplateRef) {
                    this.thenViewRef = this.viewContainer.createEmbeddedView(this.thenTemplateRef, this.context);
                }
            }
        }
    }

    private clearViewRefs(): void {
        this.viewContainer.clear();

        this.thenViewRef = null;
        this.onErrorViewRef = null;
        this.onCompletedViewRef = null;
    }

}