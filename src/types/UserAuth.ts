import { z } from "zod";
import { UserAuthSchema } from "@/schema/UserAuth";

export type UserAuth = z.infer<typeof UserAuthSchema>;