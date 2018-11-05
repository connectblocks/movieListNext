import React, {Component} from 'react';
import fetch from 'isomorphic-unfetch';
import CONFIG from '../config.json';
import * as d3 from "d3";

class Result extends Component {

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const data = [12, 8];
    const w = '200px'
    const h = 100
    const value = 'y'
    
    const svg = d3.select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
                  
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 100)
      .attr("y", (d, i) => h - 10 * d)
      .attr("width", 20)
      .attr("height", (d, i) => d * 10)
      .attr("fill", value === 'x' ? "blue": "red")
   
      svg.selectAll("text")
       .data(data)
       .enter()
       .append("text")
       .text((d) => d)
       .attr("x", (d, i) => i * 100)
       .attr("y", (d, i) => h - (d * 3 )) 
  }

  
  render() {
    return (
      <div>
        <div>{this.props.movie.title}</div>
        <div id='chart'></div>
      </div>
      
    )
  }
}

Result.getInitialProps = async function (context) {
  const { id } = context.query;
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${CONFIG.movie_db_api_key}`)
  const movie = await res.json();
  return { movie }
}

export default Result

// const Result = (props) => {
//   const budget = props.movie.budget;
//   const revenue = props.movie.revenue;
//   const square = d3.select(refs.container)
//   return (
//     <div>
//       <h1>{props.movie.title}</h1>
//       <div>{props.movie.tagline}</div>
//       <div>{props.movie.overview}</div>
//       <div>{budget}</div>
//       <div>{revenue}</div>
//       <div>{square}</div>
//       <svg with={900} height={900} ref='container'></svg>
//       <style jsx>{`
//         .bar {
//           width: 25px;
//           height: 100px;
//           display: inline-block;
//           background-color: blue;
//         }
//         `}
//         </style>

//     </div>
//     )
// }

// Result.getInitialProps = async function (context) {
//   const { id } = context.query;
//   const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${CONFIG.movie_db_api_key}`)
//   const movie = await res.json();
//   return { movie }
// }

// export default Result