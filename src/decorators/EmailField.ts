import { IsEmail } from 'class-validator';
import { Field } from 'type-graphql';
import { Column } from 'typeorm';

import { composeMethodDecorators, MethodDecoratorFactory } from '../utils';

import { WarthogField } from './WarthogField';

interface EmailFieldOptions {
  filter?: boolean;
  nullable?: boolean;
  sort?: boolean;
  unique?: boolean;
}

export function EmailField(args: EmailFieldOptions = {}): any {
  const options = { unique: true, ...args };

  const factories = [
    WarthogField('email', options),
    IsEmail(),
    Field(),
    Column(options) as MethodDecoratorFactory
  ];

  return composeMethodDecorators(...factories);
}
