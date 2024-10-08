import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { getColumnType } from '../constants/columns';

@ValidatorConstraint({ name: 'customColumn', async: false })
export class CustomColumnValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(columnName: string, args: ValidationArguments) {
    try {
      getColumnType(columnName);
      return true;
    } catch (error) {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Invalid column name. Must be one of the standard columns or match a pattern.';
  }
}
