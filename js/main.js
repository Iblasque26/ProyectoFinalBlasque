document.addEventListener("DOMContentLoaded", function () {
    const numeroCarritoElement = document.querySelector(".numeroCarrito");
    const productosDelCarritoLS = JSON.parse(localStorage.getItem("productosDelCarrito")) || [];
    const cantidadTotalEnCarrito = productosDelCarritoLS.reduce((acc, producto) => acc + producto.cantidad, 0);
    numeroCarritoElement.textContent = cantidadTotalEnCarrito;
});

let productos = [];

fetch("../js/productos.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
      productos = data;
      console.log(productos);
        cargarProductos(productos);
  })
  .catch(error => {
    console.error('Error en la solicitud fetch:', error);
  });


function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
        <div class="producto-card card shadow-sm">
    <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">
    <div class="producto-info">
        <h5 class="producto-titulo">${producto.titulo}</h5>
        <p class="producto-precio">$${producto.precio}</p>
        <button class="producto-agregar" id="${producto.id}">Agregar al Carrito</button>
    </div>
</div>

        `;
        contenedorProductos.appendChild(div);
    });
    botonAgregar();
}


const contenedorProductos = document.querySelector("#contenedorProductos");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numeroCarrito = document.querySelector(".numeroCarrito");



function botonAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosDelCarrito;

let productosDelCarritoLS = localStorage.getItem("productosDelCarrito");

if (productosDelCarritoLS) {
    productosDelCarrito = JSON.parse(productosDelCarritoLS);
    actualizarNumeroDelCarrito();
} else {
    productosDelCarrito = [];
}

function agregarAlCarrito(e) {

    Toastify({
        text: "Producto agregado al Carrito!",
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
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosDelCarrito.some(producto => producto.id === idBoton)) {
        const index = productosDelCarrito.findIndex(producto => producto.id === idBoton);
        productosDelCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosDelCarrito.push(productoAgregado);
    }
    actualizarNumeroDelCarrito();
    localStorage.setItem("productosDelCarrito", JSON.stringify(productosDelCarrito));
}

function actualizarNumeroDelCarrito() {
    let numeroActualizado = productosDelCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numeroCarrito.innerText = numeroActualizado;
}

