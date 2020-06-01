import Axios from "axios";
import Cookie from "js-cookie";
import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
} from "../constants/userConstants";

const signin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post("/api/users/signin", { email, password });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    Cookie.set("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({ type: USER_SIGNIN_FAIL, payload: error.message });
  }
};

const register = (name, email, password) => async (dispatch) => {
  console.log("register action");
  dispatch({ type: USER_REGISTER_REQUEST, payload: { name, email, password } });
  try {
    Axios.post("http://localhost:8080/ecommerce/add_user.php", {
      name,
      email,
      password,
    }).then(({ data }) => {
      if (data.success === 1) {
        console.log(data);
        dispatch({ type: USER_REGISTER_SUCCESS, payload: data.user });
        Cookie.set("userInfo", JSON.stringify(data.user));
      }
    });
  } catch (error) {
    dispatch({ type: USER_REGISTER_FAIL, payload: error.message });
  }
};

export { signin, register };
