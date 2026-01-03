export type ResBodyError = {
  success: boolean;
  data: {
    error: {
      message: string;
    };
  };
};

export type ResBodyDetailedError = {
  success: boolean;
  data: {
    error: {
      details: {
        path: string;
        message: string;
      }[];
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

export function detailedError(
  details: {
    path: string;
    message: string;
  }[],
): ResBodyDetailedError {
  return {
    success: false,
    data: {
      error: {
        details,
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
