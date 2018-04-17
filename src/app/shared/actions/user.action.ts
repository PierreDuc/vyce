import { User } from '@firebase/auth-types';

export class LogoutUser {
  static readonly type = '[USER] Logout current user';
}

export class LoginUser {
  static readonly type = '[USER] Login user';

  constructor(readonly user: User) {}
}
