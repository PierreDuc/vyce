import { User } from '@firebase/auth-types';

export class LogoutUser {}

export class UpdateUser {
  constructor(readonly user: User | null) {}
}
