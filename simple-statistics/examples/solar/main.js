var width = 960;
var height = 500;

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

var projection = d3.geoMercator()

var path = d3.geoPath()
    .projection(projection);


queue()
    .defer(d3.json, 'countries.geojson')
    .defer(d3.csv, 'data.csv')
    .await(ready);

function ready(error, geojson, data) {
    console.log(geojson);
    console.log(data);

    let capacityById = {};

    data.forEach((d) => { capacityById[d.id] = +d.capacity });

    console.log(capacityById);

    let color = d3.scaleThreshold()
        .domain(data.map((d) => { return +d.capacity }), 4)
        .range(d3.range(4).map((i) => { return `q${i}-4` }))


    let countries = svg.append('g')
        .attr('class', 'countries')
            .selectAll('path')
                .data(geojson.features)
                    .enter().append('path')
                    .attr('d', path)
                    .attr('class', (d) => { return color(capacityById[d.id]) })

}

