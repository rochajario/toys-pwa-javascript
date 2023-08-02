//Main Execution
main();

//Functions
function addCategoryItems(item) {
  addCategory(item.category);

  if (item.products.length == 0) {
    addAlert(item.category);
    return;
  }

  item.products.forEach((p) => {
    addProduct(item.category, p);
  });
}

function addCategory(category) {
  document.getElementById(
    "products"
  ).innerHTML += `<div class="my-3 h3">${category}</div>`;
  document.getElementById(
    "products"
  ).innerHTML += `<div id="${category}-products" class="d-flex flex-row flex-wrap align-center justify-content-center">`;
}

function addAlert(category) {
  document.getElementById(
    `${category}-products`
  ).innerHTML += `<div class="alert alert-warning" role="alert">
       No products from category "${category}" available.
    </div>`;
}

function addProduct(category, product) {
  document.getElementById(
    `${category}-products`
  ).innerHTML += `<div class="product-info card mb-3 mx-2">
        <img
          src="${product.image}"
          class="card-img-top"
          alt="${product.name}"
        />
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">
            ${product.description}
          </p>
          <a href="#" class="btn btn-primary">Buy for ${product.price}</a>
        </div>
    </div>`;
}

function dynamicCache(data) {
  if ("caches" in window) {
    console.log("Deleting old dynamic cache");
    caches.delete("toy-dynamic-app").then(() => {
      if (data.length > 0) {
        var files = ["products.json"];
        data.forEach((x) => {
          x.products.forEach((i) => {
            if (files.indexOf(i.image) == -1) {
              files.push(i);
            }
          });
        });
      }
    });
    caches.open("toy-dynamic-app").then((cache) => {
      cache
        .addAll([
          "../favicon.ico",
          "../offline.html",
          "../css/bootstrap.min.css",
          "../css/styles.css",
          "../imgs/logo.png",
          "../imgs/background01.jpg",
          "../imgs/background02.jpg",
          "../js/app.js",
          "../js/bootstrap.bundle.min.js",
        ])
        .then(() => {
          console.log("New dynamic cache added");
        });
    });
  }
}

function main() {
  fetch("./products.json")
    .then((res) => {
      res.json().then((items) => {
        items.forEach((content) => {
          addCategoryItems(content);
        });
        dynamicCache(items);
      });
    })
    .then(() => {
      document.getElementById("btnInstall").removeAttribute("hidden");

      let deferredPrompt;
      window.addEventListener("beforeinstallprompt", (e) => {
        deferredPrompt = e;
      });

      const installApp = document.getElementById("btnInstall");
      installApp.addEventListener("click", async () => {
        if (deferredPrompt !== null) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === "accepted") {
            deferredPrompt = null;
          }
        }
      });
    })
    .catch(() => {
      console.log(err);
    });
}
