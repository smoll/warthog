import { Service } from 'typedi';
import { DeepPartial, Repository, Transaction, TransactionManager, EntityManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { BaseService } from '../../../';
import { Dish } from './dish.model';

@Service('DishService')
export class DishService extends BaseService<Dish> {
  constructor(@InjectRepository(Dish) protected readonly repository: Repository<Dish>) {
    super(Dish, repository);
  }

  @Transaction()
  async createTwoTransactionSuccess(
    data: DeepPartial<Dish>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<Dish[]> {
    // Await the promise.all here instead of returning the promise or the Transaction won't work
    return await Promise.all([
      this.create(data, userId, { manager }),
      this.create(data, userId, { manager })
    ]);
  }

  // This opens the transaction automatically and either commits or rolls back based on whether the function
  // throws or not, so you must execute database calls in here, they cannot be returned like they are above.
  @Transaction()
  async createTwoTransactionFail(
    data: DeepPartial<Dish>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<Dish[]> {
    const invalidUserData = {};

    const users = await Promise.all([
      this.create(data, userId, { manager }),
      this.create(invalidUserData, userId, { manager }) // This one fails
    ]);

    // You cannot return a promise here or else the transaction manager will think the transaction is good
    return users;
  }
}
