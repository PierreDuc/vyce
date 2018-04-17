export namespace InputKind {
  export function values(): string[] {
    return Object.values(InputKind);
  }

  export function includes(kind: string): boolean {
    return InputKind.values().includes(kind);
  }
}

export enum InputKind {
  Video = 'videoinput',
  Audio = 'audioinput'
}
