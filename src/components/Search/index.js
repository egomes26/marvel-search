import React, { Component } from 'react';
const md5 = require('md5');
const privateKey = "39a25631403db7e951e6ff5c5bac707c0fcee174";
const publicKey = "9e80ecd4cb4f9aec0891db5d4237f744";


class Search extends Component {
    constructor(props){
        super(props);
        this.state ={
            searchInput: ''

    }   ;

    
    this.handleSearch =this.handleSearch.bind(this);        

    }


    handleSearch(e){
        this.setState({searchInput: e.target.value});
        if(Object.keys(this.state.searchInput).length >= 3){
            this.props.func(this.state.searchInput);
        }
    }

    render(){
        return (
            <div>

                <div class="title">
                    <h1>Busca de personagens</h1>
                </div>
                <div class="title-name-character">
                    <h3>Nome do personagem</h3>
                    <input placeholder="Search" 
                                type="text" 
                                name="search" 
                                value={this.state.searchInput} 
                                onChange={this.handleSearch}
                                />
                </div>
                            
            </div>


        );

  }
}

export default Search;

