import { Field, Float } from 'type-graphql';
import { Column } from 'typeorm';
import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions';
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';
import { NumericColumnType } from '../torm';

import { WarthogField } from './WarthogField';

interface NumericFieldOptions extends ColumnCommonOptions, ColumnNumericOptions {
  dataType?: NumericColumnType;
  filter?: boolean;
  nullable?: boolean;
  sort?: boolean;
}

export function NumericField(args: NumericFieldOptions = {}): any {
  const { dataType, filter, sort, ...dbOptions } = args;
  const options = { ...args };

  const nullableOption = options.nullable === true ? { nullable: true } : {};

  const factories = [
    WarthogField('numeric', options),
    Field(() => Float, {
      ...nullableOption
    }),
    Column({
      ...dbOptions,
      type: args.dataType || 'numeric'
    }) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
