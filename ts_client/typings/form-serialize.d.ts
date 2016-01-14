declare module 'form-serialize' {
  export default function serialize<T>(form: HTMLFormElement, opts?: { hash: boolean }): T;
}