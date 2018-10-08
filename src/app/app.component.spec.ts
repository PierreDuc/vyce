import { createTestComponentFactory } from '@netbasal/spectator';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const createComponent = createTestComponentFactory({
    component: AppComponent,
    shallow: true
  });

  it('should successfully instantiate', () => {
    expect(createComponent().element).toExist();
  });
});
