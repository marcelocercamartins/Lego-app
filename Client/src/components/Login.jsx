
import { Link } from "react-router-dom"
import { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import axios from 'axios'



function Login(){
    const [name,getName]= useState()
    const [password,getPassword]= useState()
    const [errorMessage, setErrorMessage] = useState(null);

    const navigate = useNavigate();

    const userObj = {name: name, password: password};

    const { storeToken, authenticateUser } = useContext(AuthContext);
    

    const handleSubmit =(e)=>{
        e.preventDefault()
        axios.post('http://localhost:3001/login', userObj,{
          method: "POST",
          body: JSON.stringify(userObj),
          headers: { "Content-type": "application/json; charset=UTF-8" }})
        .then(result => {
          storeToken(result.data.authToken);
          localStorage.setItem('user', name);
          authenticateUser();
          navigate('/content');
      
        })
        .catch(err=>{
          if (err.response.status === 404){
            setErrorMessage("User not registered");
          } else if (err.response.status === 401){
            setErrorMessage("Invalid password");
          }else{
            setErrorMessage("Not able to login at this time");
          }
        })  
    }
    return(
      <div className="wrapper fadeInDown">
        <div id="formContent">
        <div className="fadeIn first">
      </div>
          <form onSubmit={handleSubmit}>
              <div className="mb-3">
                  <label htmlFor="name">
                      <strong>Username </strong>
                   </label>
                   <input 
                      type="text"
                      placeholder="Username"
                      name="name"
                      autoComplete="off"
                      className="fadeIn second"
                      onChange={(e) => getName(e.target.value)}
                   />
            </div>
            <br></br>
            <div className="mb-3">
              <label htmlFor="password">
                  <strong>Password </strong>
                  </label>
                  <input type="password"
                    placeholder="Password"
                    autoComplete="off"
                    name="password"
                    className="fadeIn third"
                    onChange={(e) => getPassword(e.target.value)}
                  />
              {/* Display error message if there is one */}
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </div>
            <br></br>
            <button type="submit" className="btn btn-success w-100 rounder-0">Login</button>

            <p>New member? </p>
            <Link to="/signup" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
               Create an account 
               </Link>
          </form>
      </div>
    </div>
    )

  }


export default Login;