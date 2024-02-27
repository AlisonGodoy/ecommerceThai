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
      MySearch: '',
      products: productsData,
      itemsPerPage: 10,
      currentPage: 1,
  },
  computed: {
    //responsável pelo filtro no campo de busca MySearch
    filteredProducts() {
      const search = this.MySearch.toLowerCase();
      return this.products.filter(product => {
        return product.description.toLowerCase().includes(search) ||
               product.price.toString().includes(search) ||
               product.quantity.toString().includes(search) ||
               product.datecad.includes(search) ||
               product.image.toLowerCase().includes(search);
      });
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
    //aqui define o star e o end da página solicitado, retornando os dados de filteredProducts
    displayedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const slicedProducts = this.filteredProducts.slice(start, end);
      
      return slicedProducts.length > 0 ? slicedProducts : this.filteredProducts.slice(0, this.itemsPerPage);
    },
  },
  methods: {
    //envia post ao servidor
    submitForm() {
      if (this.alterProd){
        this.oper = 2;
      
      }else if(this.excluiProd){
        if (window.confirm('Tem certeza da exclusão?')) {
          this.oper = 3;
        } else {
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

    //Formata o preço para exibição
    formatPrice(price) {
      return parseFloat(price).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    },

    //Formata a data para exibição
    formatDate(date) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
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
    },

    //alterna entre as páginas
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
});