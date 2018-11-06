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
    const data = [{name: 'Budget', value: this.props.movie.budget},{name: 'Revenue', value: this.props.movie.revenue} ];
    const w = 500;
    const h = 500;
    const padding = 100;
    const topPaddingAdj = 50;
    const yScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value)]).range([h - padding, padding]);
    const xScale = d3.scaleBand().domain(data.map(d => d.name)).range([padding, w - padding]);
    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale)

    const svg = d3.select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h - 100 )

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 149 + padding + 38)
      .attr("y", (d, i) => yScale(d.value) - topPaddingAdj)
      .attr("width", 76  )
      .attr("height", (d, i) => h - yScale(d.value) - padding)
      .attr("fill", (d, i) => d.name === "Budget" ? "#673ab7" : "#ffc400")
   
    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d) => `* $ ${d.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
      .attr("x", (d, i) => i * 149 + padding + 38)
      .attr("y", (d, i) => yScale(d.value) - 5 - topPaddingAdj) 
      .attr("fill", (d, i) => d.name === 'Budget' ? '#311b92' : '#b24d00')
      .style("font", "11px times")
    
    svg.append("g")
      .attr("transform", `translate(${padding}, -${topPaddingAdj})`)
      .call(yAxis);

    svg.append("g")    
      .attr("transform", `translate(${0}, ${h - padding - topPaddingAdj})`)
      .call(xAxis)
  }

  render() {
    return (
      <div className="listDetailView">
        <h2>{this.props.movie.title}</h2>
        <div><b>Release Date: </b>{this.props.movie.release_date}</div>
        <div><b>Popularity: </b>{this.props.movie.popularity}</div>
        <div>
          <b>Overview: </b>
          <div className="details">{this.props.movie.overview}</div>
        </div>
        <div>
          <b>Production Companies: </b>
          <div className="details">{this.props.movie.production_companies && this.props.movie.production_companies.map(el => <li key={el.id}>{el.name}</li>)}</div>
        </div> 
        { 
          this.props.movie.budget && this.props.movie.revenue 
          ? (
              <div>
                <b>Budget and Revenue (in US Dollar)</b>
                <div id='chart'></div>
              </div>
            )
          : null
        }
        <style jsx>{`
          div {
            padding: 5px;
          }
          .listDetailView {
            margin: 5px;
            padding: 10px;
            border-style: none;
            border-radius: 5px;
            background-color: rgb(255, 248, 235)
          }
          .details {
            font-size: 0.8em;
            padding: 3px;
          }
          #chart {
            background: white;
            border-radius: 5px;
            width: 500px;
            margin: 10px;
          }
        `}
        </style>
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