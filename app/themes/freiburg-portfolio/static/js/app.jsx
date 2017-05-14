// Do not pollute global namespace
(function() {
  // Init variables
  const width = d3.select('#portfolio-container').node().clientWidth;
  const height = 700;
  const margin = {top: 50, bottom: 100, left: 50, right: 50};
  const dateFormat = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
  var courseY = 50; // Y value for a specific course

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

    // **************** Add each course as a unique g element *****************
    var courseElement = g.selectAll('.course')
      .data(data.portfolio)
      .enter().append('g')
      .attr('class', 'course')
      .attr('id', (d) => {
        return 'course-' + d.id;
      })
      .attr('transform', (d) => {
        let xValue = semesterScale(d.semester) + semesterScale.bandwidth() / 2;
        let yValue = courseY;
        courseY = courseY + (50 * d.portfolio.length);
        return 'translate(' + xValue + ',' + yValue + ')';
      });

    // Append line to course
    courseElement.append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 5)
      .attr('y2', (d) => {
        return 50 * d.portfolio.length - 5;
      })
      .style('stroke', '#ccc');
    // ************************************************************************

    // ******************** Add every artifact to line ************************
    courseElement.each((d) => {
      // Find course g element
      let course = svg.select('#course-' + d.id);

      // Every course has to wander a little
      // down the line
      var wanderDown = 25;

      // Add circles for each artifact to course
      course.selectAll('circle')
        .data(d.portfolio)
        .enter().append('circle')
        .attr('cy', (d) => {
          let yValue = wanderDown;
          wanderDown = wanderDown + 50;
          return yValue;
        })
        .attr('cx', 0)
        .attr('r', 5);
    });

  });

})(d3);

