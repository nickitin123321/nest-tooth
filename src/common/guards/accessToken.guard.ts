import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { MetadataKey } from '../../lib/variables';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
	constructor(private readonly reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.get<boolean>(MetadataKey.IS_PUBLIC, context.getHandler());

		if (isPublic) {
			return true;
		}

		return super.canActivate(context);
	}
}
