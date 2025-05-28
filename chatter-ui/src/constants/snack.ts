import { makeVar } from "@apollo/client";
import type { SnackMessage } from "../interface/snack-message.interface";

export const snackVar = makeVar<SnackMessage | undefined>(undefined);
