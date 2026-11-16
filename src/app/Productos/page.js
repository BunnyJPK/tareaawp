import InterfaceProducto from "../componentes/interfaceProducto";
import { createClient } from "../database/sv";



async function getProductos() {
    const bd = await createClient();
    const { data: productos, error } = await bd.from("producto").select("id, nombre, precio, descripcion, imagen");
    if (error) {
        console.error("Error al obtener los productos:", error);
        return [];
    }
    return productos;
}


export default async function ProductosPage(){

    const pr = await getProductos();

    return(
        <section>
            <InterfaceProducto productos={pr} />
        </section>
    )
}    


