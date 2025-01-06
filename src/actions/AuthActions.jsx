
import * as actionsTypes from "./actionsTypes";
import Url from '../constants/Url';
import axios from 'axios';
import Cookies from 'js-cookie'


export const loginUser = (data) => (dispatch) => {

  axios
    .post(`${Url.Url0}/signin`,

      data,
      { withCredentials: true }
    )
    .then((response) => {
      if (response.status === 200) {
        const token = response.headers["x-auth"]
        Cookies.set('userId', response.data.id)
        Cookies.set('token', token)
        const role = response.data.poste //response.data.permissions.map((element)=>{return element.name})
        Cookies.set('role',role )
        Cookies.set('fullName', response.data.firstName+" "+response.data.lastName)
        Cookies.set('login', response.data.login)
        
        data.redirectionHome()
        data.handleClickVariant("Connexion réussie!", "success",)

        dispatch({
          type: actionsTypes.LOGIN_SUCCESS,
          payload: { authSuccess: token },
        })
      }


    }
      // setCookieHeader = res.headers.get('set-cookie'),
      // console.log('first', res.headers.get('token'))
      // Split the header into an array of cookies
      // const cookies = setCookieHeader.split(',');

    )
    .catch((err) => {
      console.log("err", err.response.data.error)
      if (err.response.data.error == 'Invalid password') {
        data.handleClickVariant("Mot de passe incorrect", "error",)
      }else if(err.response.data.error == 'Invalid login'){
        data.handleClickVariant("Identifiant invalide", "error",)
      }
      dispatch({
        type: actionsTypes.LOGIN_FAIL,
        // payload: err.response.data.errors,
      })
    }
    );
};

