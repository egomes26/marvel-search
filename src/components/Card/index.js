import React,{Component} from 'react';
import { Link } from 'react-router-dom';


class Card extends Component {
    constructor(props){
        super(props);
        this.state ={
            character:[],
            img: ''

        }
    }

    
    render(){
      return (

        <div class="card" key={this.props.index}>
            <div class="collumn-card">
                <div class="thumb-character">
                    <img src={this.props.imgUri}/> 

                </div>
                <Link to={`/character/${this.props.id}`}>
                <div class="name-character">
                    <p>
                        {this.props.name}
                    </p>
                </div>
                </Link>
            </div>
            <div class="collumn-card hide-mobile serie">
                {this.props.series.map((serie)=>{
                    return(<li>{serie.name}</li>);
                })}
            </div>
            <div class="collumn-card hide-mobile serie">
                {this.props.events.map((event)=>{
                    return(<li>{event.name}</li>);
                })}
            </div>
        </div>
  
      );
  
    }
  }
  
  export default Card;
