export enum DeviceType {
  Default = 'default',
  Comm = 'communications'
}

export namespace DeviceTypes {
  export function includes(type: string): boolean {
    return Object.values(DeviceType).map((device) => device.toLowerCase()).includes(type.toLowerCase());
  }
}
