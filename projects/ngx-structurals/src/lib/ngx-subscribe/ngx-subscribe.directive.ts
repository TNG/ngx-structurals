import { Directive, EmbeddedViewRef, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

/**
 * TODO Document
 */
export class NgxRxSubscribeContext<T> {
    /**
     * TODO Document
     */
    public $implicit: T | null = null;
    /**
     * TODO Document
     */
    public errored = false;
    /**
     * TODO Document
     */
    public completed = false;
    /**
     * TODO Document
     */
    public error: any | null = null;
    /**
     * TODO Document
     */
    public count = 0;
}

/**
 * TODO Document
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
        templateRef: TemplateRef<NgxRxSubscribeContext<T>>,
    ) {
        this.templateRef = templateRef;
        this.pendingTemplateRef = templateRef;
        this.errorTemplateRef = templateRef;
        this.completeTemplateRef = templateRef;
    }

    /**
     * TODO Document
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
     * TODO Document
     */
    @Input()
    public set ngxSubscribeTemplate(templateRef: TemplateRef<NgxRxSubscribeContext<T>> | null) {
        this.templateRef = templateRef;
        this.viewRef = null;
        this.updateView();
    }

    /**
     * TODO Document
     */
    @Input()
    public set ngxSubscribePendingTemplate(templateRef: TemplateRef<NgxRxSubscribeContext<T>> | null) {
        this.pendingTemplateRef = templateRef;
        this.pendingViewRef = null;
        this.updateView();
    }

    /**
     * TODO Document
     */
    @Input()
    public set ngxSubscribeErrorTemplate(templateRef: TemplateRef<NgxRxSubscribeContext<T>> | null) {
        this.errorTemplateRef = templateRef;
        this.errorViewRef = null;
        this.updateView();
    }

    /**
     * TODO Document
     */
    @Input()
    public set ngxSubscribeCompleteTemplate(templateRef: TemplateRef<NgxRxSubscribeContext<T>> | null) {
        this.completeTemplateRef = templateRef;
        this.completeViewRef = null;
        this.updateView();
    }

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