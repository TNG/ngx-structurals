[![Build Status](https://travis-ci.com/TNG/ngx-structurals.svg?branch=master)](https://travis-ci.com/TNG/ngx-structurals)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-green.svg)](https://conventionalcommits.org)

# ngx-structurals

Structural utility directives for Angular.

The most commonly used [structural directives](https://angular.io/guide/structural-directives) are `*ngIf` and `*ngFor`
since they are shipped as built-ins with Angular. However, we are not limited to these and can implement our own. This
is an often under-appreciate, powerful concept baked into Angular. ngx-structural aims to provide structural directives
which may be useful in any Angular project.

## How to get it?

Simply install ngx-structurals with the package manager of your choice:

```
npm install --save @tngtech/ngx-structurals
yarn add @tngtech/ngx-structurals
```

You can now import `NgxStructuralsModule` into your application to get access to the directives.

## How to use it?

<!--ts-->
   * [*ngxSubscribe](#ngxSubscribe)
   * [*ngxRepeat](#ngxRepeat)
   * [*ngxAlias](#ngxAlias)
   * [ngxTemplateContext](#ngxTemplateContext)
<!--te-->

### *ngxSubscribe

*TL;DR*

```
<ng-container *ngxSubscribe="let data of data$">
    <!-- Note that this prints "null" until data$ emitted a value. -->
    Emitted: {{ value }}
</ng-container>
```

You can subscribe to an observable directly from the template using `*ngxSubscribe`. While you can achieve the same thing using `*ngIf="data$ | async as data"`,
the latter has a couple of disadvantages:
1. It fails if `data$` emits falsy values such as `0` or `null`.
2. There is no way to access error or completion information of the observable.
3. Rendering is deferred until the observable actually emits.

With `*ngxSubscribe` all of these points are addressed. Through the template context you have access to all relevant information:

```
<ng-container *ngxSubscribe="let data of data$; error as error; errored as errored; count as count; completed as completed">
    <p>Number of emitted values: {{ count }}</p>
    <p *ngIf="count > 0">Last emitted value: {{ value }}</p>
    <p *ngIf="errored">Error: {{ error }}</p>
    <p *ngIf="completed">Completed</p>
</ng-container>
```

By default, the template on which the directive is applied is used. However, you can also specify different templates for different scenarios:

```
<ng-container *ngxSubscribe="data$; then thenTemplate beforeAny pendingTemplate onError errorTemplate onCompleted completedTemplate">
</ng-container>

<ng-template #thenTemplate let-value>Value: {{ value }}</ng-template>
<ng-template #pendingTemplate>Waiting for first emission…</ng-template>
<ng-template #errorTemplate let-error="error">Error: {{ error }}</ng-template>
<ng-template #completedTemplate>Completed</ng-template>
```

This can be particularly useful for showing loading and error state.

### *ngxRepeat

*TL;DR*

```
<ul>
    <li *ngxRepeat="42; let index">Item {{ index }}</li>
</ul>
```

Renders the given template as many times as specified. This is equivalent of using `*ngFor` on an array of that length, but avoids having to initialize such
an array if you only know the number of items you want to render.

You can also access similar context information as with `*ngFor`:

```
<ng-container *ngxRepeat="3; let index; count as count; first as first; last as last; even as even; odd as odd">
    <p *ngIf="first">Start</p>
    <p>Item {{ index }} of {{ count }} is even={{ even }}, odd={{ odd }}</p>
    <p *ngIf="last">End</p>
</ng-container>
```

### *ngxAlias

*TL;DR*

```
<ng-container *ngxAlias="data$ | async as data">{{ data }}</ng-container>
```

Simply renders the given template, but allows aliasing a complex expression to a local template input variable. This is similar to using `*ngIf` for the same job,
but avoids the issues arising from falsy values which would cause the template not to render.

### ngxTemplateContext

*TL;DR*

```
<ng-template [ngxTemplateContext]="context" let-data>{{ data.prop }}</ng-template>
```

Defines the type of the context based on some object. This utility is a workaround for [#28731](https://github.com/angular/angular/issues/28731) as the context of a template is untyped. The context passed into it is some (possibly empty) object with the appropriate type, e.g.

```
context?: MyContextType;
```

Note that this directive only types the context of the directive, but cannot enforce that the context passed to the template actually matches that type.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Airblader"><img src="https://avatars3.githubusercontent.com/u/2392216?v=4" width="100px;" alt="Ingo Bürk"/><br /><sub><b>Ingo Bürk</b></sub></a><br /><a href="https://github.com/Airblader/ngx-structurals/commits?author=Airblader" title="Code">💻</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

---

[MIT License][license]

[license]: https://www.github.com/TNG/ngx-structurals/blob/master/LICENSE
