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
     console.log(response.data)
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
         <div className='detail-content'>
           <h3>Overview</h3>
           <p>{selectedMovie.overview}</p>
           {selectedMovie.credits?.cast?.length > 0 && (
             <>
               <h3>Cast</h3>
               <div className='cast-grid'>
                 {selectedMovie.credits.cast.slice(0, 6).map((person) => (
                   <div key={person.id} className='cast-member'>
                     {person.profile_path && (
                       <img
                         src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                         alt={person.name}
                       />
                     )}
                     <p>{person.name}</p>
                     <p className='character'>{person.character}</p>
                   </div>
                 ))}
               </div>
             </>
           )}
         </div>
       </div>
     )}

     {selectedMovie?.videos?.results?.[0]?.key && (
       <>
         <h3>Trailer</h3>
         <div className='video-container'>
           <iframe
             width='560'
             height='315'
             src={`https://www.youtube.com/embed/${selectedMovie.videos.results[0].key}`}
             title={selectedMovie.title}
             frameBorder='0'
             allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
             allowFullScreen
           ></iframe>
         </div>
       </>
     )}
   </div>
 )
}

export default MoviesList