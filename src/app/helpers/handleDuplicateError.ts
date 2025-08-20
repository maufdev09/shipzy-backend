import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleDuplicateError=(err: any):TGenericErrorResponse => {
      const matchedArray = err.message.match(/"([^"]*)"/);
      return {
        statusCode: 400,
        message: `${
          matchedArray ? matchedArray[1] : "Duplicate key"
        } already exists`,
      };
}

