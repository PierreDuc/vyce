import { NO_ERRORS_SCHEMA, DebugElement, Type, Component } from '@angular/core';
import { async, ComponentFixture, MetadataOverride, TestBed, TestModuleMetadata } from '@angular/core/testing';

export interface ComponentUnit<T, R = T> {
  fixture: ComponentFixture<T | R>,
  element: DebugElement,
  component: T | R
}

export function initComponent<T, R = T>(
  component: Type<T>,
  moduleDef: TestModuleMetadata = {},
  testHost?: Type<R>,
  {beforeChanges, overrides}: {
    beforeChanges?: (unit: ComponentUnit<T, R>) => void,
    overrides?: MetadataOverride<Component>
  } = {}
): ComponentUnit<T, R> {
  const unit: Partial<ComponentUnit<T, R>> = {};

  if (!moduleDef.declarations) {
    moduleDef.declarations = [];
  }

  if (!moduleDef.declarations.includes(component)) {
    moduleDef.declarations.push(component);
  }

  if (testHost && !moduleDef.declarations.includes(testHost)) {
    moduleDef.declarations.push(testHost);
  }

  if (!moduleDef.schemas) {
    moduleDef.schemas = [];
  }

  if (!moduleDef.schemas.includes(NO_ERRORS_SCHEMA)) {
    moduleDef.schemas.push(NO_ERRORS_SCHEMA);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule(moduleDef)
      .overrideComponent(component, overrides || {})
      .compileComponents();
  }));

  beforeEach(async(() => {
    if (testHost) {
      unit.fixture = TestBed.createComponent(testHost);
    } else {
      unit.fixture = TestBed.createComponent(component);
    }

    unit.element = unit.fixture.debugElement;
    unit.component = unit.element.componentInstance;

    if (beforeChanges) {
      beforeChanges(unit as ComponentUnit<T, R>);
    }

    unit.fixture.detectChanges();
  }));

  it('should create the component', async(() => {
    expect(unit.component).toBeTruthy();
  }));

  return unit as ComponentUnit<T, R>;
}
