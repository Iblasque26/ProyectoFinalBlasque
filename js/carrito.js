const carritoVacio = document.querySelector(".carritoVacio");
const carritoProductos = document.querySelector(".carritoProductos");
const carritoAcciones = document.querySelector(".carritoAcciones");
const carritoCompra = document.querySelector(".carritoCompra");
const botonVaciar = document.querySelector(".vaciarCarrito");
const botonComprar = document.querySelector(".carritoComprar");
const contTotal = document.querySelector(".total");

let botonesEliminar = document.querySelectorAll(".carritoProductoEliminar");
let productosDelCarritoLS = JSON.parse(localStorage.getItem("productosDelCarrito"));

function cargarCarrito() {
    if (productosDelCarritoLS && productosDelCarritoLS.length > 0) {
        carritoVacio.classList.add("disabled");
        carritoProductos.classList.remove("disabled");
        carritoAcciones.classList.remove("disabled");
        carritoCompra.classList.add("disabled");

        carritoProductos.innerHTML = ""; 

        productosDelCarritoLS.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("contenedorProducto");

            div.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carritoProductoTitulo">
                    <small>Titulo</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carritoProductoCantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carritoProductoPrecio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carritoProductoSubtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button id="${producto.id}" class="carritoProductoEliminar"><i class="bi bi-cart-dash"></i></button>
            `;

            carritoProductos.append(div);
        });
    } else {
        carritoVacio.classList.remove("disabled");
        carritoProductos.classList.add("disabled");
        carritoAcciones.classList.add("disabled");
        carritoCompra.classList.add("disabled");
    }
    botonEliminar();
    totalActualizado();
}

function botonEliminar() {
    botonesEliminar = document.querySelectorAll(".carritoProductoEliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarProducto);
    });
}

function eliminarProducto(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #dda15e, #bc6c25)",
          borderRadius: "1.3rem",
        },
        onClick: function(){}
      }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosDelCarritoLS.findIndex(producto => producto.id === idBoton);
    if (productosDelCarritoLS[index].cantidad > 1) {
        productosDelCarritoLS[index].cantidad--;
    } else {
        productosDelCarritoLS.splice(index, 1);
    }

    cargarCarrito();

    localStorage.setItem("productosDelCarrito", JSON.stringify(productosDelCarritoLS));
}

function vaciarCarrito() {
    Swal.fire({
        title: "Usted esta a punto de vaciar el carrito",
        icon: "warning",
        html: `Quiere vaciar?`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `Si`,
        cancelButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
            productosDelCarritoLS.length = 0;
            localStorage.setItem("productosDelCarrito", JSON.stringify(productosDelCarritoLS));
            cargarCarrito();
        }
      });
}

function totalActualizado() {
    const totalTotal = productosDelCarritoLS.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contTotal.innerText = `$${totalTotal}`;
}

function comprarCarrito() {
    productosDelCarritoLS.length = 0;
    localStorage.setItem("productosDelCarrito", JSON.stringify(productosDelCarritoLS));

    carritoVacio.classList.add("disabled");
    carritoProductos.classList.add("disabled");
    carritoAcciones.classList.add("disabled");
    carritoCompra.classList.remove("disabled");
}

cargarCarrito();

botonVaciar.addEventListener("click", vaciarCarrito);
botonComprar.addEventListener("click", comprarCarrito);