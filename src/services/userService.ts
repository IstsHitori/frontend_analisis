import type React from "react";
import type { UserRegister } from "@/types/User";
import { isAxiosError } from "axios";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "react-toastify";
import clientAxiosAuth from "@/config/axiosAuth";
import { UserArraySchema } from "@/schema/User";

type FetchProfileProps = {
  setProfileData: React.Dispatch<React.SetStateAction<UserRegister | null>>;
  form: UseFormReturn<{
    name: string;
    currentStudy: string;
    educationalInstitution: string;
    dateBirth: Date;
  }>;
  userData: UserRegister;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const fetchProfileData = async ({
  setProfileData,
  form,
  userData,
  setIsLoading,
}: FetchProfileProps) => {
  try {
    // Simular tiempo de carga
    await new Promise((resolve) => setTimeout(resolve, 500));

    // En una aplicación real, aquí harías una llamada a tu API
    // const response = await fetch('/api/profile');
    // const data = await response.json();

    // Usamos los datos simulados
    setProfileData(userData);

    // Actualizar el formulario con los datos cargados
    form.reset({
      name: userData.name,
      currentStudy: userData.currentStudy,
      educationalInstitution: userData.educationalInstitution,
      dateBirth: userData.dateBirth ? new Date(userData.dateBirth) : new Date(),
    });
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(
        error.response?.data.message || "Error al cargar los datos del perfil."
      );
    } else {
      toast.error("Error al cargar los datos del perfil.");
    }
  } finally {
    setIsLoading(false);
  }
};

export const updateProfile = async (userData: UserRegister) => {
  try {
    const response = await clientAxiosAuth.put(
      "/user/update-profile",
      userData
    );
    if (response.status !== 200) {
      throw new Error("Failed to update profile");
    }
   
    return response.data! as string;
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data.message);
    }
  }
};

export const getAllUsers = async () => {
  try {
    const { data: usersData } = await clientAxiosAuth.get("/user/");
    const { data, success } = UserArraySchema.safeParse(usersData);
    if (!success) {
      toast.error("Error al obtener los usuarios");
      return;
    }
    return data.users;
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data.message);
    }
  }
};
