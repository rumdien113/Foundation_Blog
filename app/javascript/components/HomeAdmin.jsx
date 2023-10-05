import { useState } from 'react';
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import Header from './Header';
import bg from '../../assets/images/bg'

function HomeUser() {
    return ( <div>
      <Header/>
      <img src={bg} alt="" className='w-100' />
    </div> );
}

export default HomeUser;