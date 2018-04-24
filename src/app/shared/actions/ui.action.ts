import { DocumentSnapshot } from '@firebase/firestore-types';

import { UiSnackbarConfig } from '../../core/interface/ui-snackbar-config.interface';

abstract class ShowDialog {
  protected constructor(readonly data?: object) {}
}

export class ShowLogin extends ShowDialog {
  static readonly type = '[UI] Show login popup';

  constructor() {
    super();
  }
}

export class HideLogin {
  static readonly type = '[UI] Hide login popup';
}

export class ShowAddDevice extends ShowDialog {
  static readonly type = '[UI] Show add device popup';

  constructor(readonly data: { device?: DocumentSnapshot; deviceId?: string } = {}) {
    super(data);
  }
}

export class HideAddDevice {
  static readonly type = '[UI] Hide add device popup';
}

export class ShowSnackbar {
  static readonly type = '[UI] Show snackbar';

  constructor(readonly config: UiSnackbarConfig | string) {
    if (typeof config === 'string') {
      this.config = { message: config };
    }
  }
}
