import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	register(@Body() data: RegisterDto) {
		const { email, password } = data;
		return this.authService.register(email, password);
	}

	@Post('login')
	login(@Body() data: RegisterDto) {
		const { email, password } = data;
		return this.authService.login(email, password);
	}

	@UseGuards(AccessTokenGuard)
	@Get('logout')
	async logout(@Req() req) {
		await this.authService.logout(req.user.id);
	}

	@UseGuards(RefreshTokenGuard)
	@Get('refresh')
	refreshTokens(@Req() req) {
		const userId = req.user.id;
		const refreshToken = req.user.refreshToken;
		return this.authService.refreshTokens(userId, refreshToken);
	}
}
