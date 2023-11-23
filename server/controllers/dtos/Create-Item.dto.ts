import { IsOptional, IsString } from "class-validator";

export class CreateItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  categories: string[];
}
