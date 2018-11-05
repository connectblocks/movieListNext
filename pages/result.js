
import fetch from 'isomorphic-unfetch';
import CONFIG from '../config.json';

const Result =  (props) => {
  console.log(props)
  return (
    <div>
      <h1>{props.movie.title}</h1>
      <div>{props.movie.tagline}</div>
      <div>{props.movie.overview}</div>
      <div>{props.movie.budget}</div>
      <div>{props.movie.revenue}</div>
    </div>
    )
}
Result.getInitialProps = async function (context) {
  const { id } = context.query;
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${CONFIG.movie_db_api_key}`)
  const movie = await res.json();
  return { movie }
}

export default Result