import { ConflictError } from './app-error';

export class ExistingOrderError extends ConflictError {
  constructor(message: string = 'Existing order.') {
    super(message);
  }
}
