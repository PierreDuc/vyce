export namespace DeviceType {
  export function includes(type: string): boolean {
    return Object.values(DeviceType).includes(type);
  }
}

export enum DeviceType {
  Default = 'default',
  Comm = 'communications'
}
