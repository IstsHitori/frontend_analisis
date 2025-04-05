import { z } from "zod";

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
});

export const UserArraySchema = z.object({
  users: z.array(UserSchema),
});

export const UserRegisterSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  currentStudy: z.string({
    required_error: "Por favor selecciona tu nivel de estudios actual.",
  }),
  educationalInstitution: z.string().min(2, {
    message: "Por favor ingresa el nombre de tu institución educativa.",
  }),
  dateBirth: z.date().refine((date) => date < new Date(), {
    message: "La fecha de nacimiento debe ser anterior a la fecha actual.",
  }),
});
