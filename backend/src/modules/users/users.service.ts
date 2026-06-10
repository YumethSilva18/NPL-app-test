import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: any;
  }) {
    const rounds = parseInt(this.configService.get('BCRYPT_ROUNDS', '12'));
    const hashedPassword = await bcrypt.hash(data.password, rounds);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async update(id: string, data: any) {
    if (data.password) {
      const rounds = parseInt(this.configService.get('BCRYPT_ROUNDS', '12'));
      data.password = await bcrypt.hash(data.password, rounds);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
