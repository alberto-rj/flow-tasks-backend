export class ExistingEmailError extends Error {
  constructor(message: string = 'Existing email.') {
    super(message);
  }
}
