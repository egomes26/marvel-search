import React,{Component} from 'react';
import './style.css';
import { Link } from 'react-router-dom';
const KEYS = require('../../config/keys.js')
const md5 = require('md5');

class Character extends Component {
    constructor(props){
        super(props);
        this.state ={
            character:[],
            img: '',
            series:[],
            stories:[]

        }
        this.loadCharacter =this.loadCharacter.bind(this);
    }

    componentDidMount(){
        this.loadCharacter();
    }
    
    loadCharacter(){
        const {id} = this.props.match.params;
        const timeStamp = Date.now().toString();
        const toBeHashed = timeStamp + KEYS.privateKey + KEYS.publicKey;
        const hash = md5(toBeHashed);
    
    
        const urlAPI = `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${timeStamp}&apikey=${KEYS.publicKey}&hash=${hash}`;
    
        fetch(urlAPI)
        .then((response)=> response.json())
        .then((json=>{
          let state = this.state;
          state.character = json.data.results[0];
          state.img = json.data.results[0].thumbnail.path+'.'+json.data.results[0].thumbnail.extension;
          state.series = json.data.results[0].series.items;
          state.stories = json.data.results[0].stories.items;
          this.setState(state);   
   
        }))
        .catch((error)=>{
            console.log('Error:',error)
        })
        
    }

    render(){
      return (

        <div class="container-character">
            <div class="pic">
                <img src={this.state.img}/> 
            </div>
            <h1 class="name-character">{this.state.character.name}</h1>

            <div class="description-container">
                <div class="row">
                    <h2 class="description-title">Description</h2>
                    <p>{(this.state.character.description)? this.state.character.description:'Não há descrição para esse personagem!'}</p>
                </div>

            </div>

            <div class="series-container" >
                <div class="row" >
                    <h2>Series</h2>
                    <ul class="series">
                    {this.state.series.map((serie)=>{
                        return(<li>{serie.name}</li>);
                    })}

                    </ul>
                </div>
            </div>          

            <div class="stories-container">
                <div class="row">
                    <h2>Stories</h2>
                    <ul class="stories">
                    {this.state.stories.map((storie)=>{
                        return(<li>{storie.name}</li>);
                    })}

                    </ul>
                </div>

            </div>

            <div>
                <Link to={'/'} className="btn">
                    {"< Back"}
                </Link>
            </div>

        </div>
  
      );
  
    }
  }
  
  export default Character;