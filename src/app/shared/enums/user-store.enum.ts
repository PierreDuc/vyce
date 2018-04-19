export namespace UserStore {
  export function values(): UserStore[] {
    return Object.values(UserStore);
  }
}
export enum UserStore {
  Devices = 'devices'
}
