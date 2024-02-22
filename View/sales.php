<?php

  include_once '../Model/connectDb.php';

  $sql = 'select * from product';
  $listaProduct = new connectDb();
  $products = $listaProduct->consulta($sql);

?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Sales</title>
  <link rel="stylesheet" href="../CSS/style.css">
  <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

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
  <nav>
    <div id="app">

      <button id="show-modal" @click="showModal = true">Create Product</button>
      <modal v-if="showModal" @close="showModal = false">

        <h3 slot="header">Product registration</h3>
        
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
            <button type="submit" class="btn-submit" id="submit">Cadastrar</button>
            <div v-if="showSuccessMessage">
              {{ successMessage }}
            </div>
            <div v-if="showErrorMessage">
              {{ errorMessage }}
            </div>

          </div>
        </form>
      </modal>

    </div>
    
  </nav>

  <h3>Product List</h3>

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
      <?php
        foreach($products as $product){
      ?>
        <tr>
          <td><?= $product->description //<?= forma abreviada para "<?php echo"?></td> 
          <td><?php echo $product->price?></td>    
          <td><?= $product->quantity?></td>
          <td><?= $product->datecad?></td>
          <td><?= empty($product->image) ? "Unavailable" : $product->image; ?></td>
        </tr>                    
      <?php        
          }
      ?>
    </tbody>
  </table>

</body>

<script>
  //Registra componente
  Vue.component("modal", {
      template: "#modal-template"
  });

  //Start app
  new Vue({
    el: "#app",
    data: {
        showModal: false,
        showSuccessMessage: false,
        showErrorMessage: false,
        name: '',
        price: '',
        qtd: 0,
        image: '',
    },
    methods: {
      submitForm() {
        //envia post ao servidor
        axios.post('../Control/insertProduct.php', {
          name:   this.name,
          price:  this.price,
          qtd:    this.qtd,
          image:  this.image,
          
        })
        .then(response => {
          this.name       = '';
          this.price      = '';
          this.qtd        = 0;
          this.image      = '';
          this.showModal  = false;
          const data      = response.data;

          if (data.success) {
            this.showSuccessMessage = true;
            this.successMessage     = alert(data.message);
            window.location.reload(true);

          }else {
            this.showErrorMessage = true;
            this.errorMessage     = alert(data.message);

          }           
        })
        .catch(error => {
          alert("Não foi possível enviar as informações. Tente novamente ou contate o administrador.");

        });
      },
      maskPrice() {
        //mascára para o preço
        this.price = this.price.replace(/\D/g, '');
        if (this.price.length > 2) {
            this.price = this.price.replace(/(\d{2})$/, ',$1');
        }
      },
      closeModal() {
      //método que fecha o modal, resetando seus campos
      this.name = '';
      this.price = '0,00';
      this.qtd = 0;
      this.image = '';
      this.showModal = false;
      }
    },
  });
</script>

</html>


