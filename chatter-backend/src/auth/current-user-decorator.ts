import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";

interface GraphQLContext {
  req: {
    user: User;
  };
}

const getCurrentUserByContext = (context: ExecutionContext): User => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest<{ user: User }>().user;
  } else if (context.getType<GqlContextType>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext<GraphQLContext>().req.user
  }
  throw new Error('Unsupported context type');
}


export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context)
)