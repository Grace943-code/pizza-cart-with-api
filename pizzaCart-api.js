document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function() {
      return {
            init() {
                axios
                    .get ('https://pizza-cart-api.herokuapp.com/api/pizzas')
                    .then((result) => {  
                    // console.log(result.data);
                    this.pizzas = result.data.pizzas
                     })
                    .then(() => {
                        return this.createCart();
                    })
                    // .then ((result) => {
                    //     this.cartId = result.data.cart_code
                    // });
            },

            createCart() {
                return axios.get ('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
                .then((result) => {  
                // console.log(result.data);
                this.cartId = result.data.cart_code
                 })
            },

            showCart() {
                // const cart_code = '...';
                const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

                axios
                .get(url)
                .then((result) => {
                    this.cart = result.data;
                });
            },

            pizzaImage(pizza) {
                return `./img/${pizza.size}.jpg`
            },
           
            message : 'Eating pizzas',
            username: 'Grace',
            pizzas : [],
            cartId: '',
            cart: { total: 0},
            // payNow: false,
            paymentAmount: 0,
            paymentMessage: '',

            add(pizza) {
                const params  = {
                    cart_code: this.cartId,
                    pizza_id : pizza.id
                }
            
                axios 
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
                    .then(() => {

                        this.message = "Pizzas added to the cart"
                        this.showCart();
                    })
                    .catch(err => alert(err));
            },
            
            remove(pizza) {
                const params = {
                  cart_code : this.cartId,
                  pizza_id : pizza.id
                }
                axios
                  .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
                  .then(() => {
                    this.message= "Pizzas removed from the cart"
                    this.showCart();
                  })
                  .catch(err =>alert(err));
              },
        
            pay() {
                const params = {
                  cart_code : this.cartId,
                  amount: this.paymentAmount
                  
                }
                console.log(params)
                axios
                  .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
                  .then(() => {
                      if(!this.paymentAmount) {
                          this.paymentMessage = 'No amount entered!'
                      }

                      else if(this.paymentAmount >= this.cart.total.toFixed(2)){
                          this.paymentMessage = 'Payment Sucessful!'
                          this.message= this.username  + " Paid!"
                          setTimeout(() => {
                              this.cart.total = 0;
                              this.paymentAmount = 0;
                              this.paymentMessage = '';
                              this.message = '';
                            //   window.location.reload()
                          }, 3000);
                      }else{
                          this.paymentMessage = 'Sorry - You do not have enough money!'
                          setTimeout(() => {
                              this.cart.total = '';
                              
                              
                          }, 3000);
                      }
                  })
                  .catch(err=>alert(err));
              },
        }
    });
})
        
   