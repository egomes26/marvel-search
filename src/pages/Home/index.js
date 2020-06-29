import React, {Component} from 'react';

import Card from '../../components/Card';
import Search from '../../components/Search';

const KEYS = require('../../config/keys.js')
const md5 = require('md5');

class Home extends Component{
    constructor(props){
        super(props);
        this.state ={
          characters: [],
          renderPageNumbers: [],
          charactersRender: [],
          current: 1,
          pageControl: 1,
          charactersPerPage: 10,
          pagination: {
              count: 0,
              limit: 50,
              offset: 0,
              total:  0
          }
        };

        this.loadCharacters =this.loadCharacters.bind(this);
        this.handleClick =this.handleClick.bind(this);
        this.handleNext =this.handleNext.bind(this);
        this.handlePrevious =this.handlePrevious.bind(this);
        this.handleFirst =this.handleFirst.bind(this);
        this.handleLast =this.handleLast.bind(this);
        this.handleSearch =this.handleSearch.bind(this);
        

      }

    async componentDidMount(){

        this.displayElement('first','none');
        this.displayElement('previous','none');

        this.displayElement('next','none');
        this.displayElement('last','none');
        
        await this.loadCharacters(0);
        await this.listItens(this.state.characters,this.state.current,this.state.charactersPerPage);

        this.pageNumbers(this.state.pageControl);

        this.displayElement('next','inline');
        this.displayElement('last','inline');
        
    }
    
    loadCharacters(offset){

        return new Promise((resolve,reject)=>{
            const timeStamp = Date.now().toString();
            const toBeHashed = timeStamp + KEYS.privateKey + KEYS.publicKey;
            const hash = md5(toBeHashed);   
        
            const urlAPI = `http://gateway.marvel.com/v1/public/characters?orderBy=name&limit=${this.state.pagination.limit}&offset=${offset}&ts=${timeStamp}&apikey=${KEYS.publicKey}&hash=${hash}`;
        
            fetch(urlAPI)
            .then((response)=> response.json())
            .then((json=>{
                console.log("JSON: ",json)

                let state = this.state;
                state.characters = json.data.results;

                state.pagination = {
                    count: json.data.count,
                    limit: json.data.limit,
                    offset: json.data.offset,
                    total:  json.data.total
                }
                
                this.setState(state);

                resolve(true);
        
            }))

        })
        
    }

    listItens(itens,current,limitItens){
        return new Promise((resolve,reject)=>{
            let state = this.state;

            let result =[];
            let count = (current * limitItens) - limitItens;
            let delimiter = count + limitItens;
            let pagesTotal = this.pagesTotal()

            if(current <= pagesTotal){
                for(let i = count;i < delimiter; i++){
                    result.push(itens[i]);
                    count++;
                }
            }
    
            console.log("Page Char:", result)
    
            state.charactersRender = result;

            this.setState(state);
            resolve(true);

        })

    }

    pageNumbers(pageControl){
        return new Promise((resolve,reject)=>{
            let state = this.state;            
            
            const pageNumbers = [];
            let pagesTotal = this.pagesTotal();
            console.log("Page Control:", pageControl)

            let limit = pageControl * pagesTotal;
            let start = (limit - pagesTotal)+1;

            for (let i = start; i <= limit; i++) {
                pageNumbers.push(i);
            }
    
            console.log("Page Numbers:", pageNumbers)

            state.renderPageNumbers = pageNumbers;

            this.setState(state);
            resolve(true);
        })

    }

    itemsTotal () {
        return this.state.characters.length;
    }

    pagesTotal() {
        return Math.ceil(this.itemsTotal() / this.state.charactersPerPage);
    }
    
    async handleClick(event) {
        let state = this.state;
        const pageActual = Number(event.target.id);

        this.removeActive(state.current);        
        state.current = pageActual;        
        
        await this.listItens(this.state.characters,pageActual,10)
        this.addActive(pageActual)
        this.setState(state);

        if(this.state.pageControl > 1){
            this.displayElement('next','inline');
            this.displayElement('last','inline');
            this.displayElement('first','inline');
            this.displayElement('previous','inline');
        }

    }       

    async handleNext(){


        await this.pageControl(this.state.pageControl+1);
        await this.loadCharacters(this.state.pageControl * this.state.pagination.limit);
        await this.listItens(this.state.characters,this.state.current,this.state.charactersPerPage);
        await this.pageNumbers(this.state.pageControl);       
        if(this.state.pageControl < Math.round(((this.state.pagination.total -this.state.pagination.limit )/this.state.charactersPerPage)/this.pagesTotal())){
            this.displayElement('next','inline');
            this.displayElement('last','inline');
        }else{
            this.displayElement('next','none');
            this.displayElement('last','none');
        }

        this.displayElement('first','inline');
        this.displayElement('previous','inline');

    }

    async handlePrevious(event){

        await this.pageControl(this.state.pageControl-1);
        await this.loadCharacters(this.state.pageControl * this.state.pagination.limit);
        await this.listItens(this.state.characters,this.state.current,this.state.charactersPerPage);
        await this.pageNumbers(this.state.pageControl);

        if(this.state.pageControl <= 1){
            this.displayElement('first','none');
            this.displayElement('previous','none');
        }

        this.displayElement('next','inline');
        this.displayElement('last','inline');
    }

    async handleFirst(){
        let init = 1;
        await this.loadCharacters(init);
        await this.listItens(this.state.characters,this.state.current,this.state.charactersPerPage);
        await this.pageControl(init);
        await this.pageNumbers(init);

        this.displayElement('next','inline');
        this.displayElement('last','inline');
        this.displayElement('first','none');
        this.displayElement('previous','none');

        this.removeActive(this.state.current);
        this.addActive(1);

    }

    async handleLast(){
        await this.loadCharacters(this.state.pagination.total - this.state.pagination.limit);
        await this.listItens(this.state.characters,this.state.current,this.state.charactersPerPage);

        let page = Math.round(((this.state.pagination.total -this.state.pagination.limit )/this.state.charactersPerPage)/this.pagesTotal());
        await this.pageControl(page);
        await this.pageNumbers(page);

        this.displayElement('first','inline');
        this.displayElement('previous','inline');
        this.displayElement('next','none');
        this.displayElement('last','none');
        

    }

    async pageControl(page){
        console.log("Page:",page);
        let state = this.state;
        state.pageControl = page;        
        this.setState(state);
    }

    async handleSearch(searchInput){
        return new Promise((resolve,reject)=>{
            const timeStamp = Date.now().toString();
            const toBeHashed = timeStamp + KEYS.privateKey + KEYS.publicKey;
            const hash = md5(toBeHashed);
        
            const urlAPI = `http://gateway.marvel.com/v1/public/characters?orderBy=name&nameStartsWith=${searchInput}&ts=${timeStamp}&apikey=${KEYS.publicKey}&hash=${hash}`;
        
            fetch(urlAPI)
            .then((response)=> response.json())
            .then((json=>{
            console.log("JSON SEARCH: ",json)
            let state = this.state;
            state.characters = json.data.results;

            state.pagination = {
                count: json.data.count,
                limit: json.data.limit,
                offset: json.data.offset,
                total:  json.data.total
            }
            this.setState(state);
            this.listItens(this.state.characters,this.state.current,this.state.charactersPerPage);
            this.pageNumbers(1);
            this.displayElement('first','none');
            this.displayElement('previous','none');
            this.displayElement('next','none');
            this.displayElement('last','none');
            
            }))

            resolve(true)
        });
        
    }

    removeActive(id){
        let li = document.getElementById(id);
        li.classList.remove('active')
    }

    addActive(id){
        let li = document.getElementById(id);
        li.classList.add('active')
    }

    displayElement(id,display){
        let li = document.getElementById(id);
        li.style.display = display;
    }

    render(){
        return(
            
            <div>
                <div>                        
                    <Search func={this.handleSearch} data={this.state.characters}/>
                    <div class="title-list-container">
                        <div class="title-list">
                            Personagem
                        </div>
                        <div class="title-list hide-mobile">
                            Séries
                        </div>
                        <div class="title-list hide-mobile">
                            Eventos
                        </div>
                    </div>
                    <ul>

                    {   
                    this.state.charactersRender.map((character,index)=>{
                        if(!character){
                            return;
                        }
                        return(
                            <li>

                                <Card 
                                    id={character.id} 
                                    index={index}
                                    name={character.name} 
                                    imgUri={character.thumbnail.path+"."+character.thumbnail.extension} 
                                    series={character.series.items}
                                    events={character.events.items}/>
                            </li>
                            );
                        })
                    }
                    </ul>
                        
                </div>
                <div class="footer">
                    <div>
                        <div>
                            <nav>
                                <ul class="pagination">
                                    <li className="page-item" id="first" onClick={this.handleFirst}>
                                        {`<<`}
                                    </li>
                                    
                                    
                                    <li className="page-item" id="previous" onClick={this.handlePrevious}>
                                        {`<`}
                                    </li>

                                    {this.state.renderPageNumbers.map((number,index) => {
                                        console.log(number,index)
                                        return (
                                        <li                
                                            key={index++}
                                            id={index++}
                                            onClick={this.handleClick}
                                        >
                                            {number}
                                        </li>
                                        );
                                    })}
                                    <li className="page-item" id="next" onClick={this.handleNext}>
                                        {`>`}
                                    </li>
                                    <li className="page-item" id="last" onClick={this.handleLast}>
                                        {`>>`}
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                </div>
            </div>
            

        );
    }
}

export default Home;