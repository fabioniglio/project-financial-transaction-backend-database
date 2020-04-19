// import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // TODO
    const categoryRepository = getRepository(Category);
    let findCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!findCategory) {
      findCategory = await categoryRepository.save({
        title: category,
      });
    }

    const transactionRepository = getCustomRepository(TransactionRepository);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome') {
      if (balance.total - value < 0) {
        throw new AppError('Balance Error');
      }
    }
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: findCategory.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
