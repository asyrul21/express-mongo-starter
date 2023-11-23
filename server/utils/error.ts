import { NextFunction, Response } from "express";

export interface ICatchControllerError {
  operation: string;
  statusCode: number;
  error: Error | string;
  response: Response;
  errorMessagePrefix?: string;
  next: NextFunction;
}

export const catchControllerError = ({
  operation,
  statusCode = 400,
  error,
  response,
  errorMessagePrefix = null,
  next,
}: ICatchControllerError) => {
  response.status(statusCode);
  console.log("**********************************");
  console.error(`!!! ERROR performing operation [ ${operation} ] !!!`);
  console.log("**********************************");
  console.error(error);

  let errorMessage = typeof error === "string" ? error : error.message;
  if (errorMessagePrefix && errorMessagePrefix !== "") {
    errorMessage = `${errorMessagePrefix}. ${errorMessage}.`;
  }

  next(new Error(errorMessage));
};

module.exports = { catchControllerError };
