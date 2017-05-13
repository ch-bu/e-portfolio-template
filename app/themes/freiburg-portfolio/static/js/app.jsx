// Do not pollute global namespace
(function() {
  // Init variables
  const width = d3.select('#portfolio-container').node().clientWidth;
  const height = 2000;
  const margin = {top: 50, bottom: 50, left: 50, right: 50};

  // Set initial values of svg element that
  // holds the data visualization
  var svg = d3.select('#portfolio-svg')
    .attr('width', width)
    .attr('height', height);

  // Add g element to allow for margin
  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom);

  // Read data
  d3.json('data/portfolio.json', function(error, data) {
    // Get portfolio data
    var portfolio = data.portfolio.map(function(course) {
      return course.portfolio.map(function(artifact) {
        artifact['semester'] = course.semester;
        artifact['course'] = course.name;
        artifact['course-id'] = course.id;
        artifact['field'] = course.field;
        return artifact;
      });
    });

    // Flatten array
    // http://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript
    portfolio = [].concat.apply([], portfolio);

    // We want to display each artifact on a scale that
    // is defined in semesters. Therefore, we need
    // an ordinal scale
    var semesterScale = d3.scaleBand()
      .domain(Array.from(new Set(portfolio.map(function(artifact) {
        return artifact.semester;
      }))))
      .range([0, (width - margin.left - margin.right)]);

    // Add x axis that will display the semesters
    var xAxis = d3.axisTop(semesterScale);
    g.append('g')
      .attr('class', 'x-axis')
      .call(xAxis);

  });

})(d3);

