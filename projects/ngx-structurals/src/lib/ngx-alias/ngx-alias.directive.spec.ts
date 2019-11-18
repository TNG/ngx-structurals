import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxAliasDirective } from './ngx-alias.directive';

function setupComponent<T>(component: new(...args: any[]) => T, targetSelector?: string): [ComponentFixture<T>, () => HTMLElement] {
    TestBed.configureTestingModule({
        declarations: [NgxAliasDirective, component],
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

describe('ngxAlias', () => {
    it('renders the template with an aliased property', () => {
        @Component({
            template: `<ng-container *ngxAlias="data.length as count">{{ count }}</ng-container>`,
        })
        class TestComponent {
            public data: number[] = [1, 2, 3];
        }

        const [fixture, getTarget] = setupComponent(TestComponent);
        expect(getTarget().textContent.trim()).toBe('3');

        // In-place change
        fixture.componentInstance.data.push(4);
        fixture.detectChanges();
        expect(getTarget().textContent.trim()).toBe('4');

        // Reference change
        fixture.componentInstance.data = [1, 2];
        fixture.detectChanges();
        expect(getTarget().textContent.trim()).toBe('2');
    });

    it('renders the template for falsy values', () => {
        @Component({
            template: `<ng-container *ngxAlias="data.length as count">{{ count }}</ng-container>`,
        })
        class TestComponent {
            public data: number[] = [];
        }

        const [fixture, getTarget] = setupComponent(TestComponent);
        expect(getTarget().textContent.trim()).toBe('0');
    });
});
