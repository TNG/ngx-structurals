import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxRepeatDirective } from './ngx-repeat.directive';

function setupComponent<T>(component: new(...args: any[]) => T, targetSelector?: string): [ComponentFixture<T>, () => HTMLElement] {
    TestBed.configureTestingModule({
        declarations: [NgxRepeatDirective, component],
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

describe('ngxRepeat', () => {
    it('renders nothing if the count is zero', () => {
        @Component({
            template: `<ng-container *ngxRepeat="0">Test</ng-container>`,
        })
        class TestComponent {
        }

        const [fixture, getTarget] = setupComponent(TestComponent);
        expect(getTarget().textContent.trim()).toBe('');
    });

    it('renders the template as many times as defined', () => {
        @Component({
            template: `<ng-container *ngxRepeat="3">Test</ng-container>`,
        })
        class TestComponent {
        }

        const [fixture, getTarget] = setupComponent(TestComponent);
        expect(getTarget().textContent.trim()).toBe('TestTestTest');
    });

    it('sets the current index in the context', () => {
        @Component({
            template: `
                <ng-container *ngxRepeat="3; let index">{{ index }}|</ng-container>
            `,
        })
        class TestComponent {
        }

        const [fixture, getTarget] = setupComponent(TestComponent);
        expect(getTarget().textContent.trim()).toBe('0|1|2|');
    });

    it('sets the count in the context', () => {
        @Component({
            template: `
                <ng-container *ngxRepeat="3; count as count">{{ count }}|</ng-container>
            `,
        })
        class TestComponent {
        }

        const [fixture, getTarget] = setupComponent(TestComponent);
        expect(getTarget().textContent.trim()).toBe('3|3|3|');
    });

    it('sets even and odd in the context', () => {
        @Component({
            template: `
                <ng-container *ngxRepeat="3; even as even; odd as odd">{{ even }}|{{ odd }}|</ng-container>
            `,
        })
        class TestComponent {
        }

        const [fixture, getTarget] = setupComponent(TestComponent);
        expect(getTarget().textContent.trim()).toBe('true|false|false|true|true|false|');
    });

    it('sets first and last in the context', () => {
        @Component({
            template: `
                <ng-container *ngxRepeat="3; first as first; last as last">{{ first }}|{{ last }}|</ng-container>
            `,
        })
        class TestComponent {
        }

        const [fixture, getTarget] = setupComponent(TestComponent);
        expect(getTarget().textContent.trim()).toBe('true|false|false|false|false|true|');
    });

    it('updates the context if the repetition count decreases', () => {
        @Component({
            template: `
                <ng-container *ngxRepeat="total; count as count">{{ count }}|</ng-container>
            `,
        })
        class TestComponent {
            public total = 3;
        }

        const [fixture, getTarget] = setupComponent(TestComponent);
        expect(getTarget().textContent.trim()).toBe('3|3|3|');

        fixture.componentInstance.total = 2;
        fixture.detectChanges();
        expect(getTarget().textContent.trim()).toBe('2|2|');
    });

    it('updates the context if the repetition count increases', () => {
        @Component({
            template: `
                <ng-container *ngxRepeat="total; count as count; last as last">{{ count }}|{{ last }}|</ng-container>
            `,
        })
        class TestComponent {
            public total = 2;
        }

        const [fixture, getTarget] = setupComponent(TestComponent);
        expect(getTarget().textContent.trim()).toBe('2|false|2|true|');

        fixture.componentInstance.total = 3;
        fixture.detectChanges();
        expect(getTarget().textContent.trim()).toBe('3|false|3|false|3|true|');
    });
});
