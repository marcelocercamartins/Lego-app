import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useState } from 'react'
import axios from 'axios'

function SignUp (){
    const [name,setName]= useState()
    const [email,setEmail]= useState()
    const [password,setPassword]= useState()
    const [errorMessage, setErrorMessage] = useState(null);


    const navigate = useNavigate();

    const userObj = {name: name, password: password, email: email};
    

    const handleSubmit =(e)=>{
        e.preventDefault()
        axios.post('http://localhost:3001/register', userObj)
        .then(() => {
          navigate('/login')})
        .catch(err=>{
          if (err.response.status === 409){
            setErrorMessage("User already registered");
          } else {
            setErrorMessage("Try again");
          }
        })
    
    }
    return(
      <div className="wrapper fadeInDown">
        <div id="formContent">
        <div className="fadeIn first">
          <h2></h2></div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name">
                            <strong>Username</strong>
                         </label>
                         <input 
                            type="text"
                            maxLength="25"
                            placeholder="Username (max. 25characters)"
                            autoComplete="off"
                            name="name"
                            className="fadeIn second"
                            onChange={(e) => setName(e.target.value)}
                         />
                  </div>
                  <br></br>
                  <div className="mb-3">
                    <label htmlFor="email">
                        <strong>Email</strong>
                        </label>
                        <br></br>
                        <input type="text"
                          placeholder="Email"
                          name="email"
                          className="fadeIn third"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                  </div>
                  <br></br>
                  <div className="mb-3">
                    <label htmlFor="password">
                        <strong>Password</strong>
                        </label>
                        <input type="password"
                          placeholder="Password"
                          name="password"
                          className="fadeIn third"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  </div>
                  <br></br>
                  <button type="submit" className="btn-success w-100 rounder-0">Register</button>
                  <p>Already Have an Account</p>
                  <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                     Login 
                     </Link>
                </form>
            </div>
          </div>



    );

  }


export default SignUp;