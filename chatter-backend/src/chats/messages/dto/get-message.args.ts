import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { PaginationArgs } from "src/common/dto/pagination-args.dto";

@ArgsType()
export class GetMessageArgs extends PaginationArgs {
  @Field()
  @IsNotEmpty()
  chatId: string;
}
