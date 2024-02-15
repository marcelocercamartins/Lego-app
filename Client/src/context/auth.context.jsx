import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
 
const AuthContext = React.createContext();
 
function AuthProviderWrapper(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    const activeUser = localStorage.getItem('user');
   
    
    const storeToken = (token) => {
      localStorage.setItem('authToken', token);
    }  
    
    
    const authenticateUser = () => { 
      // Get the stored token from the localStorage
      const storedToken = localStorage.getItem('authToken');

      if (storedToken) {
        try{
          const user = activeUser; 
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(user);        
        
        } catch(error){
          // If the server sends an error response (invalid token) 
          // Update state variables         
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);        
        }      
      } else {
        // If the token is not available (or is removed)
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);      
      }   
    }

    console.log("log",isLoggedIn)
   
    const removeToken = () => {               
        // Upon logout, remove the token from the localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
     
     
      const logOutUser = () => {                      
        // To log out the user, remove the token
        removeToken();
        // and update the state variables    
        authenticateUser();
      }  
    
    useEffect(() => {                                   
        authenticateUser();
    }, []);
   
    
    return (                                                   
      <AuthContext.Provider 
        value={{ 
          isLoggedIn,
          isLoading,
          user,
          storeToken,
          authenticateUser,
          logOutUser
        }}
      >
        {props.children}
      </AuthContext.Provider>
    )
  }

  AuthProviderWrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };
   
  export { AuthProviderWrapper, AuthContext };
  