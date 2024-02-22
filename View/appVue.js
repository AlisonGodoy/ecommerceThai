//Registra componente
Vue.component("modal", {
    template: "#modal-template"
});

//Start app
new Vue({
  el: "#app",
  data: {
      showModal: false,
      abrirProd: false,
      alterProd: false,
      excluiProd: false,
      showSuccessMessage: false,
      showErrorMessage: false,
      name: '',
      price: '',
      qtd: 0,
      image: '',
      id: 0,
      oper: 0,
  },
  methods: {
    //envia post ao servidor
    submitForm() {
      if (this.alterProd){
        this.oper = 2;
      
      }else if(this.excluiProd){
        if (window.confirm('Tem certeza da exclusão?')) {
          this.oper = 3;
          // Continue com a lógica de exclusão
        } else {
            // O usuário clicou em "Cancelar", então pare a execução
            return;
        }
        
      }else {
        this.oper = 1;

      }

      axios.post('../Control/validaOperacao.php', {
        name:   this.name,
        price:  this.price,
        qtd:    this.qtd,
        image:  this.image,
        oper:   this.oper,
        id:     this.id,
        
      })
      .then(response => {
        this.name       = '';
        this.price      = '';
        this.qtd        = 0;
        this.image      = '';
        this.showModal  = false;
        this.abrirProd  = false;
        this.alterProd  = false;
        this.excluiProd = false;
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

    //mascára para o preço
    maskPrice() {
      this.price = this.price.replace(/\D/g, '');
      if (this.price.length > 2) {
          this.price = this.price.replace(/(\d{2})$/, ',$1');
      }
    },

    //método para abrir a tela de alteração e deleção
    showProductModal(productId, productName, productPrice, productQtd, productImage) {
      this.showModal  = true;
      this.abrirProd  = true;
      this.alterProd  = false;
      this.excluiProd = false;
      this.name       = productName;
      this.price      = productPrice.replace(/\./g, ',');
      this.qtd        = productQtd;
      this.image      = productImage;
      this.id         = productId;
    },

    //método que fecha o modal, resetando seus campos
    closeModal() {
    this.name       = '';
    this.price      = '0,00';
    this.qtd        = 0;
    this.image      = '';
    this.showModal  = false;
    this.abrirProd  = false;
    this.alterProd  = false;
    this.excluiProd = false;
    }
  },
});