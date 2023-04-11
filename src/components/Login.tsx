import logo from "../assets/logo.svg";
import "../styles/Login.scss";
import {
  AiOutlineGoogle,
  AiOutlineMail,
  AiOutlineFacebook,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

function Login() {
  return (
    <div className="loginApp">
      <div id="logo">
        <img src={logo} alt="" />
      </div>
      <p>
        First time here? then {" "}
        <a id="sign-in" href="#">
          Sign in!
        </a>
      </p>
      <div id="email">
        <span>Email</span>
        <input type="email" />
      </div>
      <div id="password">
        <span>Password</span>
        <input id="password" type="password" />
      </div>
      <div id="agreements">
        <input type="checkbox" />
        <p>Accept all agreements</p>
      </div>
      <div id="buttons">
        <button id="forgot-password-button">Forgot password</button>
        <button id="login-button">Login</button>
      </div>
      <p>Or login with: </p>
      <div id="social-login">
        <FcGoogle id="google" />
        <AiOutlineMail id="mail" />
        <AiOutlineFacebook id="fb" />
      </div>
    </div>
  );
}

export default Login;
