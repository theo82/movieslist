import React, {useState, useEffect} from 'react'
import axios from 'axios'

const MoviesList = () => {
 const [movies, setMovies] = useState([])
 const [selectedMovie, setSelectedMovie] = useState(null)
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState(null)
 
 useEffect(() => {
  const fetchMovies = async () => {
   try{
    const response = await axios.get(
     'https://api.themoviedb.org/3/movie/popular', {
      params: {
      api_key:'76d81577aa6aa91272070860155850bd',
      language: 'en-US',
      page:1
      }
     }
    )
    setMovies(response.data.results.slice(0,10));
    setLoading(false)
    console.log(response.data.results.slice(0, 10))
    
   }catch(error) {
    console.log(error.message)
    setLoading(false);
   }
  }
  fetchMovies()
 }, [])

 const fetchMovieDetails = async (movieId) => {
  try{
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`, 
      {
        params: {
          api_key: '',
          language: 'en-US',
          append_to_response: 'credits,videos',
        },
      }
    )
    setSelectedMovie(response.data)
    setLoading(false)
  }catch(error) {
    console.log(error.message);
  }

  const closeDetails = () => {
    setSelectedMovie(null)
  }

  if(loading && !selectedMovie) return <div>Loading movies...</div>
  if(error) return <div>Error: {error}</div>
 }
  return (
    <div className='movie-app'>
      {!selectedMovie ? (
        <>
          <h2>Popular Movies</h2>
          <div className="movie-grid">
            
          </div>
        </>
      ):(
        <div className="movie-detail">

        </div>
      )}
    </div>
  )
}

export default MoviesList