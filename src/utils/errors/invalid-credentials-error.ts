import { BadRequestError } from './app-error';

export class InvalidCredentialsError extends BadRequestError {
  constructor(message: string = 'Invalid credentials.') {
    super(message);
  }
}
