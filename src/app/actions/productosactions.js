"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../database/sv";

export async function agregarProducto(nombre, precio, imagen, descripcion) {
    if (typeof nombre !== "string" || !nombre.trim() || typeof precio !== "number" || !Number.isFinite(precio) || precio <= 0 || typeof imagen !== "string" || typeof descripcion !== "string") {
        throw new Error("Datos del producto inválidos.");
    }

    const bd = await createClient();
    const { data, error } = await bd
        .from("producto")
        .insert({ nombre: nombre.trim(), precio, imagen: imagen || null, descripcion: descripcion.trim() || null })
        .select("id, nombre, precio, descripcion, imagen")
        .single();

    if (error) {
        console.error("Error al agregar el producto:", error.message);
        throw new Error("No se pudo guardar el producto.");
    }

    revalidatePath("/Productos");
    return data;
}

export async function eliminarProducto(id) {
    const bd = await createClient();
    const { data, error } = await bd
        .from("producto")
        .delete()
        .eq("id", id)
        .select("id");

    if (error) {
        console.error("Error al eliminar el producto:", error.message);
        throw new Error(`No se pudo eliminar el producto: ${error.message}`);
    }

    if (!data || data.length === 0) {
        throw new Error("No se eliminó el producto. Revisa los permisos de Supabase.");
    }

    revalidatePath("/Productos");
}
