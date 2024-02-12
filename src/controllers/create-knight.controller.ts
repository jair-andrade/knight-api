import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const createKnightBodySchema = z.object({
  name: z.string(),
  nickname: z.string(),
  birthday: z.date(),
  attributes: z.string(),
  key_attribute: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createKnightBodySchema);

type CreateKnightBodySchema = z.infer<typeof createKnightBodySchema>;

@Controller("/knights")
@UseGuards(JwtAuthGuard)
export class CreateKnightController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateKnightBodySchema) {
    const { name, nickname, birthday, attributes, key_attribute } = body;

    await this.prisma.knights.create({
      data: {
        name,
        nickname,
        birthday,

        attributes,
        key_attribute,
      },
    });
  }
}
