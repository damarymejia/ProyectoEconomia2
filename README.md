# TiendaHN - Plataforma de Comercio Electronico

Plataforma de comercio electronico desarrollada como proyecto final de la clase Economia Digital,
que integra catalogo de productos, carrito de compras, proceso de checkout,
analitica de comportamiento de usuario.

## Sitio en produccion

Frontend: https://tiendahn.onrender.com
Backend: https://tiendahn-backend.onrender.com

## Tecnologias utilizadas

### Frontend
- React 18
- Tailwind CSS
- React Router DOM
- Chart.js / React Chart.js 2
- Lucide React
- Framer Motion
- Axios

### Backend
- Java 21
- Spring Boot 3.3
- Spring Data JPA
- Spring Security
- Lombok
- Maven

### Despliegue
- Frontend: Render
- Backend: Render

## Modulos implementados

### Inicio (Home)
Pagina principal con banner animado que rota automaticamente, seccion de
categorias, productos destacados y popup promocional con codigo de descuento.

### Catalogo de productos
Listado de 28 productos organizados en 4 categorias: Electronicos, Ropa,
Hogar y Deportes. Incluye busqueda en tiempo real, filtrado por categoria
y ordenamiento por precio y nombre.

### Detalle de producto
Vista completa de cada producto con descripcion, precio, stock disponible
simulado, selector de cantidad, boton de agregar al carrito y seccion de
productos relacionados de la misma categoria.

### Carrito de compras
Gestion completa del carrito con posibilidad de agregar, eliminar y actualizar
cantidades. Calculo automatico de subtotal, impuesto del 15% y total.
Persistencia mediante localStorage para que los productos se mantengan
al recargar la pagina.

### Checkout
Formulario de datos del cliente con campos para nombre, direccion, ciudad,
telefono y correo. Calculo dinamico de envio segun la ciudad seleccionada,
con envio gratis en compras iguales o mayores a L.2000. Sistema de cupones
con validacion de codigo, fecha de expiracion y monto minimo. Formulario
dinamico que cambia segun el metodo de pago seleccionado:
- Tarjeta de credito/debito: campos de numero, vencimiento y CVV
- Transferencia bancaria: datos bancarios y campo de referencia
- Pago en efectivo: instrucciones de entrega

### Confirmacion de pedido
Pantalla de confirmacion con numero de orden generado automaticamente,
resumen completo de la compra y datos del cliente.

### Logistica
Reglas de envio implementadas por ciudad:
- Tegucigalpa: L. 50
- San Pedro Sula: L. 80
- La Ceiba: L. 120
- Otras ciudades: L. 150
- Envio gratis en compras mayores o iguales a L. 2,000

### Politicas
Pagina con politicas de devolucion (30 dias), terminos y condiciones
y aviso de privacidad.

### Analitica
Panel de administrador con metricas en tiempo real:
- Ingresos totales
- Numero de ordenes
- Eventos de carrito
- Tasa de conversion
- Ticket promedio
- Grafica de productos mas vistos
- Grafica de ventas por dia

Los datos se registran mediante un sistema de eventos personalizado
guardado en localStorage.

### Autenticacion
Sistema de login con roles. El rol administrador tiene acceso al panel
de analitica. Las rutas protegidas redirigen al login si el usuario
no esta autenticado.

Credenciales de administrador para pruebas:
- Correo: admin
- Contrasena: 1234

## Instalacion y ejecucion local

### Requisitos previos
- Node.js 18 o superior
- Java 21 o superior
- Maven 3.8 o superior
- MySQL 8.0 o XAMPP

### Frontend

1. Clonar el repositorio
git clone https://github.com/damarymejia/ProyectoEconomia2.git

2. Entrar a la carpeta del frontend
cd tiendahn/frontend

3. Instalar dependencias
npm install

4. Iniciar el servidor de desarrollo
npm start

El frontend estara disponible en http://localhost:3000

## Flujo completo de prueba

1. Abrir el sitio en el navegador
2. Navegar al catalogo y seleccionar productos
3. Agregar productos al carrito
4. Ir al carrito y verificar el calculo de totales
5. Proceder al checkout y completar el formulario
6. Aplicar el cupon DIGITAL10 para obtener 10% de descuento
7. Seleccionar metodo de pago y confirmar la compra
8. Verificar la pantalla de confirmacion con el numero de orden
9. Ingresar como administrador en /login con admin
10. Revisar el panel de analitica en /analytics

## Cupones disponibles

| Codigo | Tipo | Valor | Minimo |
|--------|------|-------|--------|
| DIGITAL10 | Porcentaje | 10% | Sin minimo |
| WELCOME50 | Fijo | L. 50 | L. 300 |
| MEGA20 | Porcentaje | 20% | L. 500 |

## Integrantes del equipo

- Damary Meliza Mejía Rodríguez- 20211920116
- Aaron Isaac Enrriquez Lopez - 20211900269

## Clase

Economía Digital 
Universidad Nacional Autonoma de Honduras - Campus Comayagua 
2026
