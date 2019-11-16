import { Directive, EmbeddedViewRef, Input, OnDestroy, Optional, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

/**
 * Context provided when using the [ngxSubscribe] directive.
 */
export class NgxRxSubscribeContext<T> {
    /**
     * The (most recently) emitted value of the bound observable.
     *
     * This always keeps the last emitted value of the bound observable and is {@code null} if the observable has not yet emitted.
     * To distinguish an emitted {@code null} value from this, use the {@link count} context variable.
     */
    public $implicit: T | null = null;
    /**
     * Whether the bound observable has errored.
     *
     * This is {@code true} if and only if the currently bound observable has errored. You can access the error using {@link error}.
     */
    public errored = false;
    /**
     * Whether the bound observable has completed.
     *
     * This is {@code true} if and only if the currently bound observable has completed.
     */
    public completed = false;
    /**
     * Error thrown by the observable.
     *
     * Holds the error thrown by the observable if it has indeed errored. This can be checked using the {@link errored} context member.
     * Otherwise this holds the value {@code null}.
     */
    public error: any | null = null;
    /**
     * Number of emitted values.
     *
     * This counter increases any time the currently bound observable emits a value.
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
 */
@Directive({
    selector: '[ngxSubscribe]',
})
export class NgxSubscribeDirective<T> implements OnDestroy {

    private context = new NgxRxSubscribeContext<T>();

    private templateRef: TemplateRef<NgxRxSubscribeContext<T>> | null = null;
    private viewRef: EmbeddedViewRef<NgxRxSubscribeContext<T>> | null = null;
    private pendingTemplateRef: TemplateRef<NgxRxSubscribeContext<T>> | null = null;
    private pendingViewRef: EmbeddedViewRef<NgxRxSubscribeContext<T>> | null = null;
    private errorTemplateRef: TemplateRef<NgxRxSubscribeContext<T>> | null = null;
    private errorViewRef: EmbeddedViewRef<NgxRxSubscribeContext<T>> | null = null;
    private completeTemplateRef: TemplateRef<NgxRxSubscribeContext<T>> | null = null;
    private completeViewRef: EmbeddedViewRef<NgxRxSubscribeContext<T>> | null = null;

    private source$: Observable<T>;
    private subscription: Subscription;

    constructor(
        private readonly viewContainer: ViewContainerRef,
        @Optional() templateRef: TemplateRef<NgxRxSubscribeContext<T>>,
    ) {
        if (!this.templateRef) {
            throw new Error(`[ngxSubscribe] can only be used as a structural directive or on an ng-template.`);
        }

        this.templateRef = templateRef;
        this.pendingTemplateRef = templateRef;
        this.errorTemplateRef = templateRef;
        this.completeTemplateRef = templateRef;
    }

    /**
     * Observable to subscribe to.
     *
     * This is the primary input for the {@code [ngxSubscribe]} directive and defines the observable which should be subscribed to.
     */
    @Input()
    public set ngxSubscribe(source$: Observable<T>) {
        if (this.source$ === source$) {
            return;
        }

        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;

            this.context = new NgxRxSubscribeContext<T>();
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
     */
    @Input()
    public set ngxSubscribeTemplate(templateRef: TemplateRef<NgxRxSubscribeContext<T>> | null) {
        this.templateRef = templateRef;
        this.viewRef = null;
        this.updateView();
    }

    /**
     * Template to show while observable has not emitted, errored or completed.
     *
     * Defines the template to be shown before the observable has either emitted a value, errored or completed.
     * If not specified, this defaults to the template on which the directive has been applied.
     * TODO: Should this default to the "value template" instead?
     * TODO: Introduce shorter alias for non-structural usage?
     */
    @Input()
    public set ngxSubscribePendingTemplate(templateRef: TemplateRef<NgxRxSubscribeContext<T>> | null) {
        this.pendingTemplateRef = templateRef;
        this.pendingViewRef = null;
        this.updateView();
    }

    /**
     * Template to show if the observable errored.
     *
     * Defines the template to be shown in case the observable has errored.
     * If not specified, this defaults to the template on which the directive has been applied.
     * TODO: Should this default to the "value template" instead?
     * TODO: Introduce shorter alias for non-structural usage?
     */
    @Input()
    public set ngxSubscribeErrorTemplate(templateRef: TemplateRef<NgxRxSubscribeContext<T>> | null) {
        this.errorTemplateRef = templateRef;
        this.errorViewRef = null;
        this.updateView();
    }

    /**
     * Template to show if the observable completed.
     *
     * Defines the template to be shown in case the observable completed.
     * If not specified, this defaults to the template on which the directive has been applied.
     * TODO: Should this default to the "value template" instead?
     * TODO: Introduce shorter alias for non-structural usage?
     */
    @Input()
    public set ngxSubscribeCompleteTemplate(templateRef: TemplateRef<NgxRxSubscribeContext<T>> | null) {
        this.completeTemplateRef = templateRef;
        this.completeViewRef = null;
        this.updateView();
    }

    /**
     * @internal
     */
    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private updateView(): void {
        if (this.context.completed) {
            if (!this.completeViewRef) {
                this.clearViewRefs();
                if (this.completeTemplateRef) {
                    this.completeViewRef = this.viewContainer.createEmbeddedView(this.completeTemplateRef, this.context);
                }
            }
        } else if (this.context.errored) {
            if (!this.errorViewRef) {
                this.clearViewRefs();
                if (this.errorTemplateRef) {
                    this.errorViewRef = this.viewContainer.createEmbeddedView(this.errorTemplateRef, this.context);
                }
            }
        } else if (this.context.count === 0) {
            if (!this.viewRef) {
                this.clearViewRefs();
                if (this.pendingTemplateRef) {
                    this.pendingViewRef = this.viewContainer.createEmbeddedView(this.pendingTemplateRef, this.context);
                }
            }
        } else {
            if (!this.viewRef) {
                this.clearViewRefs();
                if (this.templateRef) {
                    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, this.context);
                }
            }
        }
    }

    private clearViewRefs(): void {
        this.viewContainer.clear();

        this.viewRef = null;
        this.errorViewRef = null;
        this.completeViewRef = null;
    }

}