import { registerDecorator, ValidationArguments } from 'class-validator';
import { Types } from 'mongoose';

export function IsObjectId(validationOptions?: { message: string }) {
  // eslint-disable-next-line no-use-before-define
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName: propertyName,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Types.ObjectId.isValid(value); // Check if value is a valid ObjectId
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid MongoDB ObjectId`;
        },
      },
    });
  };
}
