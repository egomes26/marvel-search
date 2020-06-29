import React, { Component } from 'react';
import LogoPath from '../../assets/images/objective.png';
import '../../css/styles.css';

const name = "Ericson dos Santos Gomes"
class Header extends Component {

  render(){
    return (
      <header class="head">
      
      <div class="header-container">
        <div>
          <a class="teste logo">
            <img
              
              alt="Logo"
              title="Logo"
              src={LogoPath}
            />
  
          </a>

        </div>
        <div class="testetext-head">       
         
          <strong>{name}</strong> 
          Teste de Front-end
          <span class="icon-head">CB</span>
        </div>

      </div>

    </header>

    );

  }
}

export default Header;

