import { ConflictError } from './app-error';

export class ExistingEmailError extends ConflictError {
  constructor(message: string = 'Existing email.') {
    super(message);
  }
}
