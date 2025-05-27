import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export abstract class AbstractRepository<T extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<T>) { }

  async create(document: Omit<T, '_id'>): Promise<T> {
    try {
      const createdDocument = new this.model({
        ...document,
        _id: new Types.ObjectId(),
      });
      return (await createdDocument.save()).toJSON() as unknown as T;
    }
    catch (err) {
      throw new Error(err)
    }
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) {
      this.logger.warn('document was not found with filterQuery', filterQuery);
      throw new NotFoundException('document not found');
    }

    return document as unknown as T;
  }

  async findOneAndUPdate(
    filterQuery: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<T> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn('document was not found with filterQuery', filterQuery);
      throw new NotFoundException('document not found');
    }

    return document as unknown as T;
  }

  async find(filterQuery: FilterQuery<T>): Promise<T> {
    return (await this.model.find(
      filterQuery,
      {},
      { lean: true },
    )) as unknown as T;
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T> {
    return (await this.model.findOneAndDelete(filterQuery, {
      lean: true,
    })) as T;
  }
}
