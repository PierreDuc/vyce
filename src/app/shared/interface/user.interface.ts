import { IData } from './data.interface';

export interface IUser extends IData {
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isNewUser?: boolean;
}
