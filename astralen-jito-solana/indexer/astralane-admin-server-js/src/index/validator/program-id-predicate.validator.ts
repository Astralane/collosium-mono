import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class ProgramIdPredicateValidator
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    if (object.column === 'program_id') {
      if (object.predicates[0].type != 'eq') {
        return false;
      }
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Predicate type for "program_id" must be "eq".';
  }
}

export function IsProgramIdPredicate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ProgramIdPredicateValidator,
    });
  };
}
