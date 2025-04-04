import {z} from "zod"

export const UserSchema = z.object({
    _id: z.string(),
    name: z.string(),
    currentStudy: z.string(),
    educationalInstitution: z.string(),
    email: z.string().email(),
    role: z.enum(["admin", "estudiante"]),
    dateBirth: z.string(),
    dateCreated: z.string(),
    lastActiveAt: z.string(),
})