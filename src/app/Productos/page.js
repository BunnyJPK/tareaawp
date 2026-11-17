import InterfaceProducto from "../componentes/interfaceProducto";
import { createClient } from "../database/sv";



async function getProductos(bd) {
    const { data: productos, error } = await bd.from("producto").select("id, nombre, precio, descripcion, imagen");
    if (error) {
        console.error("Error al obtener los productos:", error);
        return [];
    }
    return productos;
}


export default async function ProductosPage(){

    const bd = await createClient();
    const [{ data: { user } }, pr] = await Promise.all([
        bd.auth.getUser(),
        getProductos(bd),
    ]);

    return(
        <section>
            <InterfaceProducto productos={pr} puedeEliminar={Boolean(user)} />
        </section>
    )
}    


