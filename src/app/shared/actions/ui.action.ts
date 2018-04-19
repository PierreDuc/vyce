import {UiSnackbarConfig} from "../../core/interface/ui-snackbar-config.interface";

export class ShowLogin {
  static readonly type = '[UI] Show login popup';
}

export class HideLogin {
  static readonly type = '[UI] Hide login popup';
}

export class ShowAddDevice {
  static readonly type = '[UI] Show add device popup';
}

export class HideAddDevice {
  static readonly type = '[UI] Hide add device popup';
}

export class ShowSnackbar {
  static readonly type = '[UI] Show snackbar';

  constructor(readonly config: UiSnackbarConfig | string) {
    if (typeof config === 'string') {
      this.config = {message: config};
    }
  }
}
