export namespace DeviceType {
  export function values(): string[] {
    return Object.values(DeviceType);
  }

  export function includes(type: string): boolean {
    return DeviceType.values().includes(type);
  }
}

export enum DeviceType {
  Default = 'default',
  Comm = 'communications'
}
