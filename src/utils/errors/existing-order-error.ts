export class ExistingOrderError extends Error {
  constructor(message: string = 'Existing order.') {
    super(message);
  }
}
