import axios from "axios";
import Cookie from "js-cookie";
import { CART_ADD_ITEMS, CART_REMOVE_ITEM } from "../constants/cartConstants";
const addToCart = (productId, qty) => async (dispatch, getState) => {
  try {
    //const { data } = await axios.get("/api/products/" + productId);
    axios
      .post("http://localhost:8080/ecommerce/findProduct.php", {
        id: productId,
      })
      .then(({ data }) => {
        if (data.success === 1) {
          let product = data.product;
          dispatch({
            type: CART_ADD_ITEMS,
            payload: {
              product: product._id,
              name: product.name,
              image: product.image,
              price: product.price,
              countInStock: product.countInStock,
              qty,
            },
          });

          const {
            cart: { cartItems },
          } = getState();
          Cookie.set("cartItems", JSON.stringify(cartItems));
        }
      });
  } catch (error) {}
};

const removeFromCart = (productId) => (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM, payload: productId });
  const {
    cart: { cartItems },
  } = getState();
  Cookie.set("cartItems", JSON.stringify(cartItems));
};

export { addToCart, removeFromCart };
