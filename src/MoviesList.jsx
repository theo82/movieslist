import React, {useState, useEffect} from 'react'
import axios from 'axios'

const MoviesList = () => {
 const [movies, setMovies] = useState([])
 const [selectedMovie, setSelectedMovie] = useState(null)
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState(null)
 
 useEffect(() => {
   const fetchMovies = async () => {
     try {
       const response = await axios.get(
         'https://api.themoviedb.org/3/movie/popular',
         {
           params: {
             api_key: '76d81577aa6aa91272070860155850bd',
             language: 'en-US',
             page: 1,
           },
         }
       )
       setMovies(response.data.results.slice(0, 10))
       setLoading(false)
     } catch (error) {
       console.log(error.message)
       setLoading(false)
     }
   }
   fetchMovies()
 }, [])

 const fetchMovieDetails = async (movieId) => {
   try {
     const response = await axios.get(
       `https://api.themoviedb.org/3/movie/${movieId}`,
       {
         params: {
           api_key: '76d81577aa6aa91272070860155850bd',
           language: 'en-US',
           append_to_response: 'credits,videos',
         },
       }
     )
     setSelectedMovie(response.data)
     setLoading(false)
   } catch (error) {
     console.log(error.message)
   }
 }
 const closeDetails = () => {
   setSelectedMovie(null)
 }

 if (loading && !selectedMovie) return <div>Loading movies...</div>
 if (error) return <div>Error: {error}</div>

 return (
   <div className='movie-app'>
     {!selectedMovie ? (
       <>
         <h2>Popular Movies</h2>
         <div className='movie-grid'>
           {movies.map((movie) => {
             return (
               <div
                 key={movie.id}
                 className='movie-card'
                 onClick={() => fetchMovieDetails(movie.id)}
               >
                 {movie.poster_path && (
                   <img
                     src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                     alt={movie.title}
                   />
                 )}
                 <h3>{movie.title}</h3>
                 <p>Rating: {movie.vote_average}/10</p>
               </div>
             )
           })}
         </div>
       </>
     ) : (
       <div className='movie-details'>
         <button onClick={closeDetails} className='back-button'>
           &larr; Back to List
         </button>
         <div className='movie-header'>
           {selectedMovie.poster_path && (
             <img
               src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
               alt={selectedMovie.title}
             />
           )}
           <div className='detail-info'>
             <h2>
               {selectedMovie.title} (
               {new Date(selectedMovie.release_date).getFullYear()})
             </h2>
             <p>
               <strong>Rating:</strong> {selectedMovie.vote_average}/10 (
               {selectedMovie.vote_count} votes)
             </p>
             <p>
               <strong>Runtime:</strong> {selectedMovie.runtime} minutes
             </p>
             <p>
               <strong>Genres:</strong>{' '}
               {selectedMovie.genres?.map((g) => g.name).join(', ')}
             </p>
           </div>
         </div>
       </div>
     )}
   </div>
 )
}

export default MoviesList