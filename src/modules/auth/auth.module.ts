import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
	imports: [UsersModule, PassportModule, JwtModule.register({})],
	providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
