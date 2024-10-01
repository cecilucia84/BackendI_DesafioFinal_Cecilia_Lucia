const socket = io();

const productList = document.getElementById("productList");
const productForm = document.getElementById("productForm");

if (productForm && productList) {
  productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;

    if (title.trim() && price.trim()) {
      socket.emit("addProduct", { title, price });

      document.getElementById("title").value = "";
      document.getElementById("price").value = "";
    } else {
      Swal.fire({
        icon: "warning",
        title: "Alerta",
        text: "Por favor, ingrese todos los campos",
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
