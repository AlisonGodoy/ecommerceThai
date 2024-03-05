<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Sales</title>
  <link rel="stylesheet" href="../CSS/style.css">
  <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script defer src="appVue.js"></script>

  <!-- Template do Modal-->
  <script type="text/x-template" id="modal-template">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <slot name="header"></slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                default body
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>  
  </script>

</head>
<body>
  <div id="app">
    <div id="header">
      <div id="title">
        <h3>Welcome Administrator</h3>
      </div>
      <button id="btnHeader" @click="showModal = true">Create Product</button>
    </div>
      <modal v-if="showModal" @close="showModal = false">

      <h3 slot="header" v-if="!abrirProd">Insert Product</h3>
      <h3 slot="header" v-else>Update Product</h3>
        
      <form class="custom-form" slot="body" @submit.prevent="submitForm">
        <div class="form-group">
          <label class="form-label" for="name">Name:</label>
          <input type="text" class="form-control" id="name" v-model="name" required>
        
          <label class="form-label" for="price">Price:</label>
          <input type="text" class="form-control" id="price" v-model="price" @input="maskPrice" aria-label="Price" required>

          <label class="form-label" for="qtd">Quantity:</label>
          <input type="number" class="form-control" id="qtd" v-model="qtd" required>
        
          <label class="form-label" for="image">URL Image:</label>
          <input type="text" class="form-control" id="image" v-model="image">

          <button type="button" class="btn-submit" @click="closeModal">Cancelar</button>

          <button type="submit" class="btn-submit" id="submit" v-if="!abrirProd">Cadastrar</button>
          <button type="submit" class="btn-submit" id="submit" @click="alterProd = true" v-else>Alterar</button>
          <button type="submit" class="btn-submit" id="submit" @click="excluiProd = true" v-if="abrirProd">Excluir</button>
          
          <div v-if="showSuccessMessage">
            {{ successMessage }}
          </div>
          <div v-if="showErrorMessage">
            {{ errorMessage }}
          </div>

        </div>
      </form>
      </modal>

    <div class="table-description">
      <h3>Product List</h3>   
    </div>
    <input type="search" id="search" v-model="MySearch" class="form-control" placeholder="Search for any of the columns"/>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Register</th>
          <th>URL Image</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in displayedProducts" :key="product.id">
          <td @click="showProductModal(product.id, product.description, product.price, product.quantity, product.image)" class="colunaClique">{{ product.description }}</td>
          <td>R${{ formatPrice(product.price) }}</td>
          <td>{{ product.quantity }}</td>
          <td>{{ formatDate(product.datecad) }}</td>
          <td>{{ product.image || "Unavailable" }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-container">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </div>
    <span style="margin-left: 1600px;">Total products: {{ filteredProducts.length }}</span>
  </div>          
</body>

</html>


