import { Global, Module } from "@nestjs/common";
import { PUB_SUB } from "../constants/injection-token";
import { PubSub } from "graphql-subscriptions";

// export interface PubSubEvents {
//   messageReceived: { chatId: string; content: string };
//   // add more events as needed
//   [eventName: string]: unknown;
// }

@Global()
@Module({
  providers: [
    { provide: PUB_SUB, useValue: new PubSub<Record<string, unknown>>() }
  ],
  exports: [PUB_SUB],
})

export class PubSubModule { }
