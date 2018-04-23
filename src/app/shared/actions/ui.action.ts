import { UiSnackbarConfig } from '../../core/interface/ui-snackbar-config.interface';

abstract class ShowDialog {
  constructor(readonly input?: any) {}
}

export class ShowLogin extends ShowDialog {
  static readonly type = '[UI] Show login popup';
}

export class HideLogin {
  static readonly type = '[UI] Hide login popup';
}

export class ShowAddDevice extends ShowDialog {
  static readonly type = '[UI] Show add device popup';
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
