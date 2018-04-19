import {MatSnackBarConfig} from "@angular/material";

export interface UiSnackbarConfig {
  message: string;
  action?: string;
  config?: MatSnackBarConfig
}
