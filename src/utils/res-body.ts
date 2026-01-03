export type ResBodyError = {
  success: boolean;
  data: {
    error: {
      message: string;
    };
  };
};

export type ResBodyValidationError = {
  success: boolean;
  data: {
    error: {
      properties:
        | {
            [x: string]:
              | {
                  errors: string[];
                }
              | undefined;
          }
        | undefined;
    };
  };
};

export type ResBodyResult<T> = {
  success: boolean;
  data: {
    results: T[];
  };
};

export type ResBodyResultList<T> = {
  success: boolean;
  data: {
    results: T;
  };
};

export type ResBodyItem<T> = {
  success: boolean;
  data: {
    [key: string]: T;
  };
};

export function error(message: string): ResBodyError {
  return {
    success: false,
    data: {
      error: {
        message,
      },
    },
  };
}

export function validationError(
  properties:
    | {
        [x: string]:
          | {
              errors: string[];
            }
          | undefined;
      }
    | undefined,
): ResBodyValidationError {
  return {
    success: false,
    data: {
      error: {
        properties,
      },
    },
  };
}

export function result<T>(resource: T): ResBodyResult<T> {
  return {
    success: true,
    data: {
      results: [resource],
    },
  };
}

export function resultList<T>(resources: T): ResBodyResultList<T> {
  return {
    success: true,
    data: {
      results: resources,
    },
  };
}

export function item<T>(key: string, value: T) {
  return {
    success: true,
    data: {
      [key]: value,
    },
  };
}
