const socket = io();

socket.on("updateProductList", (products) => {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; 

  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.title} - $${product.price}`;
    productList.appendChild(li);
  });
});
