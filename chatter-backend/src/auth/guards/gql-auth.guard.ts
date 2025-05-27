import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { User } from "src/users/entities/user.entity";

interface GraphQLContext {
  req: Request & { user: User };
}

export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext<GraphQLContext>().req;
  }
}