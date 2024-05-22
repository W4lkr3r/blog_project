import { useEffect,useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
export default function Header(){
   //we will check if we have loggeg in we have to change the login and register syntax 
  const {setUserInfo,userInfo}=useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);
   

  function logout(){
    fetch('http://localhost:4000/logout',{
      credentials:'include',
      method:'POST',
    });
    setUserInfo(null);
  }

    const username=userInfo?.username;

    return(
    <header>
    <Link to="/" className="logo">MyBlog</Link>
    <nav>
      {username &&(
        <>
       
        <Link to="/create">Create New post</Link>
        <Link onClick={logout}>Logout({username})</Link>
        </>
      )}
      {!username &&(
        <>
         <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
        </>
      )}
      
    </nav>
  </header>
    );
}
