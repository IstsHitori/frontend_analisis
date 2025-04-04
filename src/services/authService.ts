import clientAxiosAuth from "@/config/axiosAuth";
import { UserAuthSchema } from "@/schema/UserAuth";

export const fetchUserProfile = async () => {
  const token = localStorage.getItem("analisis-token");
  if (!token) return;
  const {data} = await clientAxiosAuth.get("/user/get-profile");
  
  const {success, data:dataUser} = UserAuthSchema.safeParse(data);
  if(!success) {
    throw new Error("Error al obtener el perfil del usuario");
  } 

  return dataUser;
};