// Do not pollute global namespace
(function() {
  // Init variables
  const width = d3.select('#portfolio-container').node().clientWidth;
  const height = 700;
  const margin = {top: 50, bottom: 100, left: 50, right: 50};
  const dateFormat = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

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
    // ***************** Set up data ******************************************
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
    // ***********************************************************************


    // ******************* Create x axis *************************************
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
    // ************************************************************************


    // ****************** Create y axis ***************************************
    // We will display time on two axises. On the y axis we show a more
    // fine grained display of when an artifact has been handed in.
    var timeScale = d3.scaleLinear()
      .domain(d3.extent(portfolio.map(function(artifact) {
        return new Date(artifact.date);
      })))
      .range([0, height - margin.top - margin.bottom]);
    // ************************************************************************


    // **************** Add artifacts as dots to svg **************************
    var artifacts = g.selectAll('circle')
      .data(portfolio)
      .enter().append('circle')
      .attr('class', 'artifact')
      .attr('cx', (d) => {
        return semesterScale(d.semester);
      })
      .attr('cy', (d) => {
        return timeScale(new Date(d.date));
      })
      .attr('r', 5);
    // ************************************************************************


    console.log(d3.extent([2, 3, 5]));



  });

})(d3);

