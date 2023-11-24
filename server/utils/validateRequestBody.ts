import { ClassConstructor } from "class-transformer";
import { validate } from "class-validator";

export const validateRequestBody = async <T>(
  DTO: ClassConstructor<unknown>,
  requestBody: any
) => {
  const DtoInstance = new DTO();
  Object.keys(requestBody).forEach((k) => {
    DtoInstance[k] = requestBody[k];
  });
  const errors = await validate(DtoInstance as object);
  // console.log("Validation errors:", errors);
  if (errors.length > 0) {
    let errorMessage = "";
    errors.forEach((e: any, idx: number) => {
      const constrainst = e.constraints;
      Object.keys(constrainst).forEach((k) => {
        errorMessage += `${constrainst[k]}`;
      });
      if (idx !== errors.length - 1) {
        errorMessage += ", ";
      }
    });
    throw new Error(errorMessage);
  }
  return requestBody as T;
};
