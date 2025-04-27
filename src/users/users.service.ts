// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type UserWithoutPassword = {
  user_ID: number;
  username: string;
  isAdmin: boolean;
  // otras propiedades excepto password y métodos
};
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    try {
      const existingUser = await this.findByUsername(createUserDto.username);
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }

      const user = this.usersRepository.create(createUserDto);
      await this.usersRepository.save(user);

      const { password, ...userWithoutPassword } = user;
      console.log(password);
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to create user');
    }
  }

  async findByUsername(username: string): Promise<User | undefined | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | undefined | null> {
    return this.usersRepository.findOne({ where: { user_ID: id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.remove(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { user_ID: id },
      relations: ['posts'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }
}
