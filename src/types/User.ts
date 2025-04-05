import { z } from "zod";
import { UserSchema } from "@/schema/User";

export type User = z.infer<typeof UserSchema>;

export type UserRegister = Pick<User, "currentStudy" | "educationalInstitution" | "name"> & {
    dateBirth: Date;
}