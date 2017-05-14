// Do not pollute global namespace
(function() {
  // Init variables
  const width = d3.select('#portfolio-container').node().clientWidth;
  const height = 700;
  const margin = {top: 50, bottom: 100, left: 50, right: 200};
  const dateFormat = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
  var courseY = 40; // Y value for a specific course
  // This value indicates the y distance of artifacts
  const artifactDistance = 30;
  const circleR = 6;

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

    // ******************* Create scale for field colors *********************
    var fieldColors = d3.scaleOrdinal()
      .domain(['Fachdidaktik', 'Fachwissenschaft', 'Bildungswissenschaft'])
      .range(d3.schemeCategory10);

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

    var xAxisBottom = d3.axisBottom(semesterScale);
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + (height - margin.top - margin.bottom + 30) + ')')
      .call(xAxis)
      .selectAll('line')
        .attr('y2', -32)
        .attr('y1', -25);
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
      .attr('y1', -12)
      .attr('y2', (d) => {
        return artifactDistance * d.portfolio.length + 12;
      })
      .style('stroke', '#666666');

    // Append name of course to course element
    courseElement.append('text')
      .text(d => {
        return d.name;
      })
      .attr('dx', 5)
      .attr('dy', 0)
      .style('fill', '#000');

    // ************************************************************************

    // ******************** Add every artifact to line ************************
    courseElement.each((d) => {
      // Find course g element
      let course = svg.select('#course-' + d.id);

      // Every course has to wander a little
      // down the line
      var wanderDown = artifactDistance / 2;

      // Add g for each artifact to course
      course.selectAll('g')
        .data(d.portfolio)
        .enter().append('g')
        .attr('class', 'artifact')
        .attr('id', (d) => {
          return 'artifact-' + d.id;
        })
        .attr('transform', d => {
          let yValue = wanderDown;
          wanderDown = wanderDown + artifactDistance;
          return 'translate(0' + ',' + yValue + ')';
        });
    });

    // Add circles to each artifact indicating the
    // link that each artifact makes
    g.selectAll('.artifact').each(d => {
      // Get artifact
      let artifact = g.select('#artifact-' + d.id);

      // Find parent course
      let parent = data.portfolio.filter(parent => {
        return parent.id == d['parent-course'];
      })[0];

      // There is no parent element
      // this artifact stands on its own
      if (!parent) {
        artifact.append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', circleR)
          .style('fill', fieldColors(d.field));
      } else {
        // Add parent circle
        artifact.append('circle')
          .attr('cx', 3)
          .attr('cy', 0)
          .attr('r', circleR)
          .style('fill', fieldColors(parent.field));

        // Add artifact circle
        artifact.append('circle')
          .attr('cx', -3)
          .attr('cy', 0)
          .attr('r', circleR)
          .style('fill', fieldColors(d.field));
      }
    });



  });

})(d3);

