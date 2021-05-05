import React, {useState} from "react";
import "./App.css";
import logo from "./logo-shopify.jpg";


const App = () => {
 
  const [query, setQuery] = useState("");
  const [nominations, setnom] = useState([]);
  const [count, setCount] = useState(0);

  const[loadRef, setLoad] = useState(true); 

  //getting nomination list from local storage
  if (loadRef === true)
  {
    const getNomListFromLS = () => {

      if (localStorage.getItem("count") === null){
        localStorage.setItem("count", JSON.stringify(0));
        localStorage.setItem("nominations", JSON.stringify([]));
      }
      else{

        let c = JSON.parse(localStorage.getItem("count", JSON.stringify(count)));
        setCount(c);

        let nList = JSON.parse (localStorage.getItem("nominations", JSON.stringify(nominations)));
        setnom(nList);
      }
      setLoad(false);
      return;
    }
    getNomListFromLS();
  }

  //saving data to local storage

  window.onbeforeunload = function (){

    localStorage.setItem("count", JSON.stringify(count));
    localStorage.setItem("nominations", JSON.stringify(nominations));

  }



  const [movies, setMovies] =  
    useState({ res: null,
      title: null,
      search: null
    });
    
    //fetching movies from the api
    const getMovies  = async(e) => {
    
    e.preventDefault();

    if (query !== "")
    {
      const url = `http://www.omdbapi.com/?s=${query}&apikey=f432b1e3&`;
      const resp = await fetch(url);
      const data = await resp.json();

     
      if (data.Response === "False")
      {
       setMovies({res: false, title: query});
      }
      else
      {
        setMovies({res: true, title: query, search: data.Search });
      }
    }
      
  }

  //checking if a movie is already in the nomination list 
  const movieExists = (id) =>
  {
    if (nominations.length > 0)
    {
      for (let i=0; i<nominations.length; i++ )
      {
        if (nominations[i].imdbID === id)
        {
          return true;
        }

      }
    }
    return false;
  }

  //adding movie to the nomination list
  const addMov = (movie, e) =>{
      e.preventDefault();
      const m = {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster
      };

      let arr = nominations;
      arr.push(m);
      setnom(arr);
      console.log(nominations);
  }

  //removing a movie from the nomination list
  const ReMov = (movie, e) =>{
    e.preventDefault();

    for (let i=0; i<nominations.length; i++ )
    {
      if (nominations[i].imdbID === movie.imdbID)
      {
        nominations.splice(i, 1);
        return;
      }

    }
    
  }

  return (

    <div className="App-back">

      {
        count === 5 ? 
        
        <div className="ban">Your Nomination List is Full!</div>
        
        : 
        <></>
      }
    

      <div className="App">

        <div className="NameHeader" >

          <div className="AppName">
            <div class="nameText">The Shoppies</div>
          </div>
          <img className="shopLogo" src={logo} alt="Shopify Logo"/>

        </div>

        <form className="searchForm" onSubmit={getMovies} >

          <input type="text" placeholder="Search Movie Title" className="searchBar" name="movie"
          
          onChange={ e => setQuery(e.target.value) } />
          <input className="btnS" type="submit" text="search"/>
          
        </form>
        
        <div className="sResNom">
          <div className="sRes" >
            { movies.res ? 
            <>
            <div className="res" >Top Results for '{movies.title}'</div>

            {movies.search.map(movie => (

              <div className="movieBox" key = {movie.imdbID}>
                        
                <img className="poster" src={movie.Poster} alt="Poster" />
                <div className="info">
                  <div className="title"><b>Title:</b> {movie.Title}</div>
                  <div className="year"><p><b>Year:</b> {movie.Year}</p></div>
                  <div className="imID"><p><b>imdbID:</b> {movie.imdbID}</p></div>
                  <button
                  onClick={(e) => {addMov(movie, e); setCount(count+1)} }
                  disabled = { movieExists(movie.imdbID) === true || count >=5  }
                  className="btnS"
                  >Nominate</button>
                </div>
              </div>
            
            )) 
            }
            </> : <></> }
            { (movies.res===false) ? <div className="res">Movie '{movies.title}' not found!</div> : <></> }
          </div>

          <div className="Nom">
            <div className="nomHead">Your Nominations ({count})</div>

            {nominations.map(n => (

              <div className="NomiBox" key = {n.imdbID}>
                        
                <img className="nPoster" src={n.Poster} alt="Poster"/>

                <div className="nInfo">
                  <div className="tit"><p><b>Title:</b> {n.Title}</p></div>
                  <div><p><b>Year:</b> {n.Year}</p></div>
                  <div><p><b>imdbID:</b> {n.imdbID}</p></div>
                  <button className="btnN"
                  onClick={(e) => {ReMov(n, e); setCount(count-1)}  }
                  >Remove</button>
                </div>
                

              </div>

              )) 
              }

          </div>
        </div>

        
      </div>
    </div>
  );
}

export default App;
