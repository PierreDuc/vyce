import {User} from '@firebase/auth-types';

export class LogoutUser {
  static type = '[USER] Logout current user';
}

export class LoginUser {
  static type = '[USER] Login user';

  constructor(readonly user: User) {}
}

