"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  User,
  GraduationCap,
  School,
  Save,
  UserCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuth } from "@/hooks/auth/useAuth";
import type { UserRegister } from "@/types/User";
import { UserRegisterSchema } from "@/schema/User";
import { fetchProfileData } from "@/services/userService";
import { useUser } from "@/hooks/user/useUser";
import { toast } from "react-toastify";

export default function ProfileUpdateForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserRegister | null>(null);
  // Inicializar el formulario
  const form = useForm<z.infer<typeof UserRegisterSchema>>({
    resolver: zodResolver(UserRegisterSchema),
    // Inicialmente vacío, se llenará cuando se carguen los datos
    defaultValues: {
      name: "",
      currentStudy: "",
      educationalInstitution: "",
      dateBirth: new Date(),
    },
  });
  //
  const { updateProfile } = useUser();

  // Simular la carga de datos del perfil (como si fuera una llamada a API)
  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name,
        currentStudy: user.currentStudy,
        educationalInstitution: user.educationalInstitution,
        dateBirth: new Date(user.dateBirth),
      };
      fetchProfileData({ setProfileData, form, userData, setIsLoading });
    }
  }, [form, user]);

  async function onSubmit(values: UserRegister) {
    setIsSubmitting(true);

    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const message = await updateProfile(values);
      if (!message) {
        toast.error("Error al guardar los datos del perfil.");
        return;
      }
      toast.success(message);
      // Actualizar los datos locales
      setProfileData({
        ...profileData!,
        ...values,
      });
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    user && (
      <div className="w-full grid gap-8 lg:grid-cols-12">
        {/* Sidebar with profile picture */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>
                {isLoading ? (
                  <Skeleton className="h-7 w-32 mx-auto" />
                ) : (
                  profileData?.name || "Tu Perfil"
                )}
              </CardTitle>
              <CardDescription>
                {isLoading ? (
                  <Skeleton className="h-4 w-48 mx-auto mt-2" />
                ) : (
                  "Actualiza tu información personal y académica"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center">
                <div className="rounded-lg bg-muted p-4">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-5 w-36 mx-auto mb-2" />
                      <Skeleton className="h-4 w-full mx-auto" />
                      <Skeleton className="h-4 w-full mx-auto mt-1" />
                      <Skeleton className="h-4 w-3/4 mx-auto mt-1" />
                    </>
                  ) : (
                    <>
                      <h3 className="mb-2 font-medium">
                        ¿Por qué es importante?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Mantener tu perfil actualizado nos permite ofrecerte una
                        experiencia personalizada y recomendaciones relevantes
                        para tu nivel educativo.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main form content */}
        <div className="lg:col-span-9">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal" disabled={isLoading}>
                Información Personal
              </TabsTrigger>
              <TabsTrigger value="academic" disabled={isLoading}>
                Información Académica
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 pt-6"
              >
                <TabsContent value="personal">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Información Personal
                      </CardTitle>
                      <CardDescription>
                        Actualiza tu información de contacto y datos personales
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {isLoading ? (
                        <>
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        </>
                      ) : (
                        <>
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre completo</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      className="pl-10"
                                      placeholder="Tu nombre completo"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="dateBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fecha de nacimiento</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      className="pl-10"
                                      type="date"
                                      value={
                                        field.value
                                          ? new Date(field.value)
                                              .toISOString()
                                              .split("T")[0]
                                          : ""
                                      }
                                      onChange={(e) => {
                                        const date = new Date(e.target.value);
                                        field.onChange(date);
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="academic">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Información Académica
                      </CardTitle>
                      <CardDescription>
                        Actualiza tu nivel educativo e institución
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {isLoading ? (
                        <>
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-4 w-3/4 mt-1" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        </>
                      ) : (
                        <>
                          <FormField
                            control={form.control}
                            name="currentStudy"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nivel de estudios actual</FormLabel>
                                <div className="relative">
                                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="pl-10">
                                        <SelectValue placeholder="Selecciona tu nivel de estudios" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="primaria">
                                        Primaria
                                      </SelectItem>
                                      <SelectItem value="Secundaria">
                                        Secundaria
                                      </SelectItem>
                                      <SelectItem value="Pregrado">
                                        Pregrado
                                      </SelectItem>
                                      <SelectItem value="Postgrado">
                                        Postgrado
                                      </SelectItem>
                                      <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <FormDescription>
                                  Selecciona el nivel educativo que estás
                                  cursando actualmente.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="educationalInstitution"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Institución educativa</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      className="pl-10"
                                      placeholder="Nombre de tu institución"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isSubmitting ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </div>
      </div>
    )
  );
}
