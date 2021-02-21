import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxTemplateContextDirective } from './ngx-template-context.directive';
import { Component } from '@angular/core';

function setupComponent<T>(component: new(...args: any[]) => T, targetSelector?: string): [ComponentFixture<T>, () => HTMLElement] {
    TestBed.configureTestingModule({
        declarations: [NgxTemplateContextDirective, component],
    });

    TestBed.compileComponents().then();
    const fixture = TestBed.createComponent(component);
    fixture.detectChanges();

    return [
        fixture,
        () => targetSelector
            ? (fixture.nativeElement as HTMLElement).querySelector(targetSelector) as HTMLElement
            : fixture.nativeElement as HTMLElement,
    ];
}

describe('ngxTemplateContext', () => {
    it('should render the template as usual with the additional directive', () => {
        @Component({
            template: `
                <ng-template #testTemplate [ngxTemplateContext]="context" let-data>{{ data.prop }}</ng-template>
                <ng-container *ngTemplateOutlet="testTemplate; context: context"></ng-container>
            `,
        })
        class TestComponent {
            public context: { $implicit: { prop: number } } = {$implicit: {prop: 42}};
        }

        const [_, getTarget] = setupComponent(TestComponent);
        expect(getTarget().textContent.trim()).toBe('42');
    });
});
