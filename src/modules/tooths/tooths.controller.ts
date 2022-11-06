import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('tooths')
@UseGuards(AuthGuard)
export class ToothsController {
	async getTooths() {
		return;
	}
}
