import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (sumBalance: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            // eslint-disable-next-line no-param-reassign
            sumBalance.income += transaction.value;
            break;
          case 'outcome':
            // eslint-disable-next-line no-param-reassign
            sumBalance.outcome += transaction.value;
            break;
          default:
            break;
        }

        return sumBalance;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
