import Axios from "axios";
import Cookie from "js-cookie";
import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_LOGOUT,
} from "../constants/userConstants";

const signin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
  try {
    //const { data } = await Axios.post("/api/users/signin", { email, password });
    Axios.post("http://localhost:8080/ecommerce/check_user.php", {
      email: email,
      password: password,
    }).then(({ data }) => {
      if (data.success === 1) {
        dispatch({ type: USER_SIGNIN_SUCCESS, payload: data.user });
        Cookie.set("userInfo", JSON.stringify(data.user));
      }
    });
  } catch (error) {
    dispatch({ type: USER_SIGNIN_FAIL, payload: error.msg });
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
    dispatch({ type: USER_REGISTER_FAIL, payload: error.msg });
  }
};

const logout = () => (dispatch) => {
  Cookie.remove("userInfo");
  dispatch({ type: USER_LOGOUT });
};

const update = ({ userId, name, email, password }) => async (
  dispatch,
  getState
) => {
  const {
    userSignin: { userInfo },
  } = getState();
  dispatch({
    type: USER_UPDATE_REQUEST,
    payload: { userId, name, email, password },
  });
  try {
    const { data } = await Axios.put(
      "/api/users/" + userId,
      { name, email, password },
      {
        headers: {
          Authorization: "Bearer " + userInfo.token,
        },
      }
    );
    dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
    Cookie.set("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({ type: USER_UPDATE_FAIL, payload: error.message });
  }
};

export { signin, update, register, logout };
