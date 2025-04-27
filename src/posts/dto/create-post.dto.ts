import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  //@IsNumber()
  // @IsString()
  @Transform(({ value }) => {
    const number = Number(value);
    if (isNaN(number)) {
      throw new Error('No se pudo convertir a número');
    }
    return number;
  })
  userId: number;
}
