import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    const passwordsMatch = await argon2.verify(user.passwordHash, password);

    if (!passwordsMatch) {
      throw new UnauthorizedException('incorrect password');
    }

    return this.getTokens(user.id, user.email);
  }

  async register(email: string, password: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (user) {
      throw new BadRequestException('user already exists');
    }

    const passwordHash = await this.hashData(password);

    const newUser = await this.prismaService.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    return this.getTokens(newUser.id, newUser.email);
  }

  async logout(userId: number) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const refreshTokenHash = await this.hashData(refreshToken);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: refreshTokenHash },
    });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) throw new UnauthorizedException('Access Denied');

    return await this.getTokens(user.id, user.email);
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    await this.updateRefreshToken(userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
