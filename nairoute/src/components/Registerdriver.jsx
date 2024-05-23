import React from 'react'
import { useState } from 'react';

const Temmp = () => {
  const [signup,setsignup] = useState(false)
  if(!setsignup){
    <registerdriver/>
  }
  return (
    <div>
        <div class="intro">
      <h1>Welcome to Driver registration Page</h1>
      <h2>Enter your details</h2>
    </div>

    <form action=" " method="post">
      <div class="register">
        <div class="left">
          <p>
            <label for="firstName">First Name</label>
          </p>
          <p>
            <input type="text" name="firstname" id="firstName" />
          </p>
          <p>
            <label for="secondName">Second Name</label>
          </p>
          <p>
            <input type="text" name="secondname" id="secondName" />
          </p>
          <p>
            <label for="email">Email</label>
          </p>
          <p>
            <input type="email" name="email" id="email" />
          </p>
          <label for="phonenumber">Phone No.</label>
          <p>
            <input type="number" name="phonenumber" id="phonenumber" />
          </p>
        </div>
        <div class="right">
          <p>
            <label for="licensenumber">license No.</label>
          </p>
          <p>
            <input type="number" name="licensenumber" id="licensenumber" />
          </p>
          <p>
            <label for="Password">Password</label>
          </p>
          <p>
            <input type="password" name="password" id="password" />
          </p>
          <p>
            <label for="Confirm pass">Confirm password</label>
          </p>
          <p>
            <input type="password" name="confirmpass" id="Confirmpass" />
          </p>
        </div>
      </div>
      <button id="signup" value="Sign up" >Sign up</button>
    </form>  
    </div>
  )
}

export default Temmp