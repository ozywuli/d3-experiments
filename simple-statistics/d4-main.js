let width = 960;
let height = 500;

let scales = {};

// scales.quantize = d3.scaleQuantize()
//     .domain([0, .15])
//     .range(d3.range(9).map(function(i) {
//         return `q${i}-9`; 
//     }));

let projection = d3.geoAlbersUsa()


let path = d3.geoPath().projection(projection)

let svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

queue()
    .defer(d3.json, 'us.json')
    .defer(d3.csv, 'unemployment.csv')
    .await(ready);

function ready(error, us, unemployment) {
    let rateById = {};

    unemployment.forEach(function(d) { rateById[d.id] = +d.rate; });

    scales.jenks9 = d3.scaleThreshold()
        .domain(ss.jenks(unemployment.map(function(d) { return +d.rate; }), 9))
        .range(d3.range(9).map(function(i) { return `q${i}-9`; }));

    let counties = svg.append('g')
        .attr('class', 'counties')
            .selectAll('path')
                .data(topojson.feature(us, us.objects.counties).features)
                    .enter().append('path')
                    .attr('d', path);

    // d3.selectAll('input').on('change', function() {
    //     setScale(this.id);
    // });
    
    console.log(scales);

    function setScale(s) {
        console.log(s);
        counties.attr('class', function(d) { return scales[s](rateById[d.id]); })
    }

    setScale('jenks9');

    // svg.append('path')
    //     .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }))
    //     .attr('class', 'states')
    //     .attr('d', path);
}