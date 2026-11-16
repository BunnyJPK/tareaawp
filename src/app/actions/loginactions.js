"use server";
import { createClient } from "../database/sv";

export async function iniciarSesion(correo, contrasena) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: contrasena,
  });
  if (error) {
    return { error: "No se pudo iniciar sesión. Revisa tus datos." };
  }
  return { error: null };
}

export async function cerrarSesion() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: "No se pudo cerrar sesión. Inténtalo de nuevo." };
  }

  return { error: null };
}
