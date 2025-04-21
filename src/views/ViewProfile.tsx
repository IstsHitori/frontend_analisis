import ProfileUpdateForm from "@/components/user/ProfileUpdateForm"

export default function ViewProfile() {
  return (
    <div className="w-full h-full p-4 md:p-6 overflow-y-auto">
      <h1 className="mb-4 text-2xl md:text-3xl font-bold">Actualizar Perfil</h1>
      <ProfileUpdateForm />
    </div>
  )
}

