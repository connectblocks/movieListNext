import React, {Component} from 'react';
import fetch from 'isomorphic-unfetch';
import CONFIG from '../config.json';
import * as d3 from "d3";

class Result extends Component {

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
  if(!this.props.movie.budget || !this.props.movie.revenue) {
    return; 
  }
    const data = [{name: 'budget', value: this.props.movie.budget},{name: 'revenue', value: this.props.movie.revenue} ];
    const w = 500;
    const h = 300;
    
    const yScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value)]).range([h, 0]);
    const xScale = d3.scaleLinear().domain([0, w]).range([0, w]);
    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);

    const svg = d3.select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * w / 3)
      .attr("y", (d, i) => yScale(d.value))
      .attr("width", w / 4)
      .attr("height", (d, i) => h - yScale(d.value))
      .attr("fill", (d, i) => d.name === 'budget' ? '#482880' : '#ffc400')
   
    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d) => d.value)
      .attr("x", (d, i) => i * w / 3)
      .attr("y", (d, i) => 200) 
    
    svg.append("g")
      .attr("transform", `translate(${w - 50}, 0)`)
      .call(yAxis);

    svg.append("g")        
      .attr("transform", `translate(0, ${h})`)
      .call(xAxis);
  }

  render() {
    return (
      <div>
        <h2>{this.props.movie.title}</h2>
        <div><b>Release Date: </b>{this.props.movie.release_date}</div>
        <div><b>Popularity: </b>{this.props.movie.popularity}</div>
        <div>
          <b>Overview: </b>
          <div>{this.props.movie.overview}</div>
        </div>
        <div>
          <b>Production Companies </b>
          <div>{this.props.movie.production_companies && this.props.movie.production_companies.map(el => <li key={el.id}>{el.name}</li>)}</div>
        </div> 
        { 
          this.props.movie.budget && this.props.movie.revenue 
          ? (
              <div>
                <b>Budget and Revenue </b>
                <div id='chart'></div>
              </div>
            )
          : null
        }
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