import React, { useState } from "react";
import { Link } from "react-router-dom";
// Icons

import EmailOutline from "mdi-material-ui/EmailOutline";
import {
  EyeOffOutline,
  EyeOutline,
  LockOutline,
  AccountOutline,
} from "mdi-material-ui";

// loader
import Loader from "../../constants/Loader";
import { connect } from "react-redux";
import * as actionCreator from "../../actions";
import { Routes, Route, useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import { useSnackbar } from "notistack";

const Login = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  const [login, setLogin] = useState(null);
  const [password, setPassword] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginAuth = (e) => {
    e.preventDefault();
    setLoading(true);
    if(!login || !password){
      let variant = "error";
        enqueueSnackbar(msg, { variant });
    }
    const data = {
      login: login,
      password: password,
      redirectionHome: () => {
        redirectionHome();
      },
      handleClickVariant: (msg, val) => {
        let variant = val;
        enqueueSnackbar(msg, { variant });
      },
    };
    // fetch("http://127.0.0.1:8080/api/userService/signin", {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     login: "admin",
    //     password: "admin"

    //   }),

    // })
    //   .then((response) =>

    //     console.log('resheaderxxxget', response.headers.get("x-auth") )
    //   )
    //   .then((json) => {

    //   })
    props.loginUser(data);
  };
  const redirectionHome = () => {
    // navigate('/')
    window.location.replace("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-secondary-100 p-8 rounded-xl shadow-2xl w-auto lg:w-[450px]">
        <h1 className="text-3xl text-center font-bold text-white mb-8">
          Bienvenue <span className="text-primary">USINA</span>
        </h1>
        <form  onSubmit={(e) => loginAuth(e)}>
          <div className="relative mb-4">
            <AccountOutline className="absolute top-1/2 -translate-y-1/2 left-2 text-primary" />
            <input
              onChange={(e) => setLogin(e.target.value)}
              className="py-3 pl-10 pr-4 bg-secondary-900 w-full outline-none rounded-lg color-Input"
              placeholder="Login"
            />
          </div>
          <div className="relative mb-8">
            <LockOutline className="absolute top-1/2 -translate-y-1/2 left-2 text-primary" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="py-3 px-10 bg-secondary-900 w-full outline-none rounded-lg color-Input"
              placeholder="Mot de passe"
            />
            {showPassword ? (
              <EyeOffOutline
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-primary"
              />
            ) : (
              <EyeOutline
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-primary"
              />
            )}
          </div>
          <div>
            <button
              type="submit"
              className="bg-primary text-black uppercase font-bold text-sm w-full py-3 px-4 rounded-lg"
            >
              Connexion
            </button>
          </div>
        </form>
        {/* <div className="flex flex-col items-center gap-4">
          <Link
            // to="/olvide-password"
            className="hover:text-primary transition-colors"
          >
            Mot de passe oublié?
          </Link>
        </div> */}
      </div>

      {/* {loading && <Loader/>} */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    detailsUser: state.auth.detailsUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (data) => dispatch(actionCreator.loginUser(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
