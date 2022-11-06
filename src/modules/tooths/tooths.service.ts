import { Injectable } from '@nestjs/common';
import { Tooth } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToothsService {
	constructor(private readonly prismaService: PrismaService) {}

	async findOne(name: string): Promise<Tooth> {
		return this.prismaService.tooth.findUniqueOrThrow({ where: { name } });
	}

	async createOne(name: string, isBabyTooth: boolean) {
		this.prismaService.tooth.create({ data: { name, isBabyTooth } });
	}
}
