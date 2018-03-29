import { User } from '@firebase/auth-types';

export class LogoutUser {}

export class LoginUser {
  constructor(readonly user: User) {}
}
