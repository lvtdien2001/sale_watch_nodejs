import Cart from '../models/cart.model';

import cartServices from '../services/cart.service'

import watchServices from '../services/watch.service'


// @route POST /cart
// @desc create a new cart
// @access private (user)
exports.create = async (req, res) => {
   
    try { 
        
       
        
        
    } catch (error) {
        console.log(error);
    }
}

// @route GET /cart
// @desc get all cart
// @access private (admin)
exports.get = async (req, res) => {
   
    try { 
        // const id = req.session.authState?.user._id;
        const id = req.session.authState?.user._id;
    
      
        const response = await cartServices.findAll({})
        
        
        res.render('cart/home',{
            layout: 'main',
            carts: response.carts,
            helpers: {
                number: num =>  num + 1,
                formatPrice: price => {
                    price = price.toString();
                    if (price.length <= 3)
                        return price;
                
                    let priceFormat = [];
                    for (let i=price.length; i>0; i-=3)
                        priceFormat.push(price.substring(i-3, i));
                
                    return priceFormat.reverse().join('.') + ' đ';
                },
                totalPrice: (priceWatch, quantity) => {
                    let price = priceWatch * quantity;
                    price = price.toString();
                    if (price.length <= 3)
                        return price;
                
                    let priceFormat = [];
                    for (let i=price.length; i>0; i-=3)
                        priceFormat.push(price.substring(i-3, i));
                
                    return priceFormat.reverse().join('.') + ' đ';
                },
            }
        })
        
        
    } catch (error) {
        console.log(error);
    }
}

