import { BadRequestException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserRepository } from './user.repository';
import { S3Service } from 'src/common/s3/s3.service';
import { USERS_BUCKET, USERS_IMAGE_FILE_EXTENSION } from './users.constants';
import { UserDocument } from './entities/user.document';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) { }

  async create(createUserInput: CreateUserInput) {
    try {
      const user = await this.userRepository.create({
        ...createUserInput,
        password: await this.hashPassword(createUserInput.password),
      })
      return this.toEntity(user);
    } catch (err) {
      if (err.message.includes(" E11000")) {
        throw new UnprocessableEntityException('Email already exists.')
      }
      throw err
    }
  }
  async uploadImage(file: Buffer, userId: string) {
    await this.s3Service.upload({
      bucket: USERS_BUCKET,
      key: this.getUserImage(userId),
      file,
    })
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async findAll() {
    const users = await this.userRepository.find({})
    return users.map(userDocument => this.toEntity(userDocument));
  }

  async findOne(_id: string) {
    return this.toEntity(await this.userRepository.findOne({ _id }));
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await this.hashPassword(updateUserInput.password)
    }
    return this.toEntity(await this.userRepository.findOneAndUPdate(
      { _id },
      {
        $set: {
          ...updateUserInput,
        },
      },
    ));
  }

  async remove(_id: string) {
    return this.toEntity(await this.userRepository.findOneAndDelete({ _id }));
  }


  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email })

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid')
    }

    return this.toEntity(user);
  }

  toEntity(userDocument: UserDocument): User {
    const user: any = {
      ...userDocument,
      imageUrl: this.s3Service.getObjectUrl(
        USERS_BUCKET,
        this.getUserImage(userDocument._id.toHexString())
      ),
    };

    delete user.password;
    return user
  }

  private getUserImage(userId: string) {
    return `${userId}.${USERS_IMAGE_FILE_EXTENSION}`
  }
}
