import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const title = document.querySelector('.projects-title');
title.textContent = `${projects.length} Projects`;

let query = '';

let searchInput = document.querySelector('.searchBar');

function setQuery(data, value) {
    return data.filter((project) => {
      let values = Object.values(project).join('\n').toLowerCase();
      return values.includes(value.toLowerCase());
    });
  }

  let selectedIndex = -1;
  let searchQuery = ''; //change for comibined filter

function renderPieChart(projectsGiven) {
    
    let newRolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year,
    );

    let newData = newRolledData.map(([year, count]) => {
      return { value: count, label: year};
    });

    let newArcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(50);

    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => newArcGenerator(d));

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    let legend = d3.select('.legend');
    legend.selectAll('li').remove(); //remove previous legend
    newData.forEach((d, idx) => {
        legend
          .append('li')
          .attr('style', `--color:${colors(idx)}`)
          .attr('class', 'legend-item')
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
      });

    legend
      .selectAll('li')
      .attr('class', (_, idx) =>
        idx === selectedIndex ? 'legend-item selected' : 'legend-item'
      );
    
    let svg = d3.select('svg');
    svg.selectAll('path').remove();
      
    newArcs.forEach((arc, i) => {
        svg
          .append('path')
          .attr('d', arc)
          .attr('fill', colors(i))
          .attr('class', i === selectedIndex ? 'selected' : '')
          .on('click', () => {
            selectedIndex = selectedIndex === i ? -1 : i;
            renderPieChart(projectsGiven);
          });

      });
      if (selectedIndex === -1) {
        renderProjects(projectsGiven, projectsContainer, 'h2');
      } else {
        let year = newData[selectedIndex].label;
      
        let filtered = projectsGiven.filter(
          project => project.year === year
        );
      
        renderProjects(filtered, projectsContainer, 'h2');
      }
  }
  renderPieChart(projects);

  searchInput.addEventListener('input', (event) => {
    searchQuery = event.target.value;
    selectedIndex = -1;

    let filtered = setQuery(projects, searchQuery);
    renderPieChart(filtered);
    // re-render legends and pie chart when event triggers
    // renderPieChart(filteredProjects);

  });

