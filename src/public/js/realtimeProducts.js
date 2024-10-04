const socket = io();

const productList = document.getElementById("productList");
const productForm = document.getElementById("productForm");

if (productForm && productList) {
  productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;

    if (title.trim() && price.trim()) {
      // Emitir evento para agregar el producto
      socket.emit("addProduct", { title, price });

      // Limpiar campos del formulario
      document.getElementById("title").value = "";
      document.getElementById("price").value = "";

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "¡Producto Agregado!",
        text: `El producto "${title}" ha sido agregado con éxito.`,
        confirmButtonText: "Aceptar"
      });
    } else {
      // Mostrar alerta de advertencia si faltan campos
      Swal.fire({
        icon: "warning",
        title: "Alerta",
        text: "Por favor, ingrese todos los campos",
        confirmButtonText: "Aceptar"
      });
    }
  });

  socket.on("updateProductList", (products) => {
    productList.innerHTML = "";

    products.forEach((product) => {
      const li = document.createElement("li");
      li.textContent = `${product.title} - $${product.price}`;
      productList.appendChild(li);
    });
  });
} else {
  console.error("Los elementos del formulario o la lista de productos no existen en el DOM.");
}
