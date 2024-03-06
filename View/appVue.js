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
      id_category: 0,
      image: '',
      id: 0,
      oper: '',
      metodo: '',
      MySearch: '',
      products: [],
      itemsPerPage: 10,
      currentPage: 1,
  },
  mounted() {
    //Executa quando o Vue é montado
    axios.get('http://127.0.0.1:8000/api/products') //busca todos os produtos da API
      .then((response) => {
        this.products = response.data.products;
      })
      .catch((error) => {
        console.error('Erro na API:', error);
      });
  },

  computed: {
    //responsável pelo filtro no campo de busca MySearch
    filteredProducts() {
      const search = this.MySearch.toLowerCase();
      return this.products.filter(product => {
        const categoryId = product.id_category;
        const categoryDescription = this.categoryMappings[categoryId]; //retorna a descrição da categoria informado em categoryMappings

        return product.description.toLowerCase().includes(search) ||
               product.price.toString().includes(search) ||
               product.quantity.toString().includes(search) ||
               categoryDescription.toLowerCase().includes(search) ||
               product.datecad.includes(search) ||
               (product.image && product.image.toLowerCase().includes(search)); //necessário "product.image &&" para só acessar as funções se não for nulo
      });
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },

    //Relaciona ID com a descrição das categorias
    categoryMappings() {
      return {
        1: 'Equipamentos',
        2: 'Vestimentas',
        3: 'Acessórios',
        4: 'Colecionáveis',

      };
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
    //chama a API de acordo com o método a ser executado
    submitForm() {
      if (this.alterProd){
        this.oper = 'update';
        this.metodo = 'patch';
      
      }else if(this.excluiProd){
        if (window.confirm('Tem certeza da exclusão?')) {
          this.oper = this.id; //pois para o delete o id é passado diretamente na URL
          this.metodo = 'delete';
          
        } else {
            return;
        }
        
      }else {
        this.oper = 'create';
        this.metodo = 'post';
      }

      axios[this.metodo]('http://127.0.0.1:8000/api/products/'+this.oper, {
        description:  this.name,
        price:        this.price,
        quantity:     this.qtd,
        id_category:  this.id_category,
        image:        this.image,
        id:           this.id,
        
      })
      .then(response => {
        this.name         = '';
        this.price        = '';
        this.qtd          = 0;
        this.id_category  = 0; 
        this.image        = '';
        this.showModal    = false;
        this.abrirProd    = false;
        this.alterProd    = false;
        this.excluiProd   = false;
        const data        = response.data;

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

    //Retorna descrição da categoria.
    getCategoryDescription(categoryId) {
      return this.categoryMappings[categoryId] || 'Não Categorizado';

    },

    //Mascára para o preço
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

    //Método para abrir a tela de alteração e deleção
    showProductModal(productId, productName, productPrice, productQtd, productCategory, productImage) {
      this.showModal    = true;
      this.abrirProd    = true;
      this.alterProd    = false;
      this.excluiProd   = false;
      this.name         = productName;
      this.price        = productPrice.replace(/\./g, ',');
      this.qtd          = productQtd;
      this.id_category  = productCategory;
      this.image        = productImage;
      this.id           = productId;
    },

    //Método que fecha o modal, resetando seus campos
    closeModal() {
    this.name         = '';
    this.price        = '0,00';
    this.qtd          = 0;
    this.id_category  = 0;
    this.image        = '';
    this.showModal    = false;
    this.abrirProd    = false;
    this.alterProd    = false;
    this.excluiProd   = false;
    },

    //Alterna entre as páginas
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
});