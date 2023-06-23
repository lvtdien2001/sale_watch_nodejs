
import watchModel from '../models/watch.model';
import cartServices from '../services/cart.service'




// @route POST /cart/add/:id
// @desc create a new cart
// @access private (user)
exports.create = async (req, res) => {
   
    try { 
        const quantity = req.body.quantity;

        const watchId = req.params.id;
        const userId = req.session.authState?.user._id;
        req.session.message = 'Đã thêm vào giỏ hàng thành công'
        req.session.success = true;
        if(!userId) {
            let cart = req.cookies.cart || [];
            
              
                if (cart.length === 0) {
                    cart.push({watchId: watchId, quantity: parseInt(quantity)});
                } else {
                    for (let i = 0; i< cart.length ; ++i) {
                        if (cart[i].watchId !== watchId) {
                            cart.push({watchId: watchId, quantity: parseInt(quantity)});
                        } 
                    }
                }
            res.cookie('cart', cart);
            return res.redirect('back');
        }
        
        await cartServices.create(parseInt(quantity), watchId, userId);
        

        res.redirect('back')
        
    } catch (error) {
        console.log(error);
    }
}

// @route GET /cart
// @desc get all cart
// @access private (admin)
exports.get = async (req, res) => {
    try {       
            const id = req.session.authState?.user._id;
    
            let cartsRender = [];
            if (id) {
                const cartsDB = await cartServices.findAll({userId :id})
                cartsRender = cartsDB.carts
            } else {
                const watchId = req?.cookies?.cart?.map(item => item.watchId) || []
                const cartCookies = await watchModel.find({ _id: { $in: watchId }}).sort({"createdAt": 1}).lean()
                const cartsCookies = cartCookies.map((item, index) => { 
                        return {
                            quantity: req?.cookies?.cart[index]?.quantity,
                            watchId: item
                        }
                    }
                )
                cartsRender = cartsCookies
            }
          
        
        
        res.render('cart/home',{
            carts: cartsRender,
            user: req.session.authState?.user,
            message: req.session.message,
            success: req.session.success,
            helpers: {
                number: num =>  num + 1,
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
                checkCarts: cartsArray => cartsArray.length === 0 ? true : false,
                clearMessage: () => {
                    req.session.message = undefined;
                    req.session.success = undefined;
                }
            },

        })
        
        
    } catch (error) {
        console.log(error);
    }
}


// @route update /cart/update/:id
// @desc update quantity cart
// @access public and having token
exports.update = async (req, res) => {
   
    try { 
        const userId = req.session.authState?.user._id;
        const watchId = req.params.id;
        const quantity = parseInt(req.body.quantity);
        if (userId){
            await cartServices.updateQuantity(quantity, watchId, userId)
        } else {
            const cart = req?.cookies?.cart || [];
            // const cartUpdate = cart.map(item => {
            //     if (item.watchId === watchId) {
            //         return {
            //             quantity,
            //             watchId: item.watchId
            //         }
            //     }
            //     return item
            // })
            // res.cookie('cart', cartUpdate)
            const index = cart.findIndex(function(item) {
                return item.watchId === watchId;
            });
           
            if (index !== -1) {
                cart[index].quantity = quantity;
                res.cookie('cart', cart);
            }
        }
       
        req.session.message = 'Đã cập nhật thành công !'
        req.session.success = true;
       
       
        res.redirect('back')
    } catch (error) {
        console.log(error);
    }
}





// @route DELETE /cart/delete/:id
// @desc delete cart
// @access public and having token
exports.delete = async (req, res) => {
   
    try { 
        const userId = req.session.authState?.user._id;
        const watchId = req.params.id
        
        if (userId) {
            
            await cartServices.deleteById({"userId": userId, "watchId": watchId})
        } else {
            
            const cart = req.cookies.cart || [];
            var index = cart.findIndex(function(item) {
                return item.watchId === watchId;
            });
            if (index !== -1) {
                cart.splice(index, 1);
                res.cookie('cart', cart);
            }
        }
        
       
       
        res.redirect('back')
    } catch (error) {
        console.log(error);
    }
}

