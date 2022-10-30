import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { genSalt, hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(email: string): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({ where: { email } });
  }

  async createOne(email: string, password: string) {
    const passwordHash = await this.hashPassword(password);
    this.prismaService.user.create({ data: { email, passwordHash } });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }
}
