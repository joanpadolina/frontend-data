const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-12/sparql"
const query = `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?type ?continentLabel(COUNT(?cho) AS ?choCount) WHERE {
  VALUES ?type { "Foto" "foto" "Negatief" "negatief" "Glasnegatief" "glasnegatief" "Dia" "dia" "Kleurendia" "kleurendia" "Lichtbeeld" "lichtbeeld"}
  ?cho dc:type ?type ;
        dc:title ?title .
   FILTER langMatches(lang(?title), "ned")
<https://hdl.handle.net/20.500.11840/termmaster2> skos:narrower ?continent .
?continent skos:prefLabel ?continentLabel .
?continent skos:narrower* ?place .
?cho dct:spatial ?place .
} GROUP BY ?type ?continentLabel
ORDER BY DESC(?choCount)`

fotoData()
async function fotoData() {
    return await fetch(url + "?query=" + encodeURIComponent(query) + "&format=json") //omzetten naar json en geschikt maken voor de het ophalen uit browser
        .then(data => data.json())
        .then(json => {
            const resultsQuery = json.results.bindings
                .map(result => {

                    return {
                        category: result.type.value.toLowerCase(),
                        continent: result.continentLabel.value,
                        value: Number(result.choCount.value)
                    }
                })
            // createVisual(resultsQuery)
            updateContinent(resultsQuery)
            return resultsQuery
        })
    // .then(resultsQuery => {   
    //     //roy csuka!!! / laurens
    //         let transformed =  d3.nest()
    //         .key(d => d.category)
    //             // .rollup(d => {
    //             //     return {
    //             //         fotoCategories: d3.sum(d.map(sumCategory => sumCategory.value)),
    //             //         continent: d.map(console.log(d))
    //             //     }
    //             // })
    //             .entries(resultsQuery);
    //             // console.log(transformed)
    //         createVisual(transformed)
    //         return transformed
    // })

}

// stijlen binnen elke continenenten 


// Scale ordinal van Mike Bostock met mijn eigen colorpalette
function colorList() {
    return d3.scaleOrdinal(["#29A567", "#586BA4", "#ED4D6E", "#FAFFD8", "#AED9E0", "#FECCBA"])
}
const color = colorList()



// https://bl.ocks.org/syncopika/f1c9036b0deb058454f825238a95b6be

function updateContinent(data) {

// toggle continent

// var az = [];
// var af = [];
// var am = [];
// var oc = [];
// var eu = [];
// for (const continent in data){
//     console.log(data)
//     if(data[i]["continent"] === "Amerika"){
// 		am.push(data[i]);
// 	}else if(data[i]["continent"] === "Azië"){
// 		az.push(data[i]);
// 	}else if(data[i]["continent"] === "Afrika"){
// 		af.push(data[i]);
// 	}else if(data[i]["continent"] === "Oceanië"){
// 		oc.push(data[i]);
// 	}else if(data[i]["continent"] === "Eurazië"){
// 		eu.push(data[i]);
// 	}else{
// 		console.log('not working')
// 	}
// }

// for(var i = 0; i < data.length; i++){
// 	if(data[i]["continent"] === "Amerika"){
// 		am.push(data[i]);
// 	}else if(data[i]["continent"] === "Azië"){
// 		az.push(data[i]);
// 	}else if(data[i]["continent"] === "Afrika"){
// 		af.push(data[i]);
// 	}else if(data[i]["continent"] === "Oceanië"){
// 		oc.push(data[i]);
// 	}else if(data[i]["continent"] === "Eurazië"){
// 		eu.push(data[i]);
// 	}else{
// 		console.log('not working')
// 	}
// }



    // console.log(dataNest)
    // const nestedContinent = d3.nest()
    //     .key(d => d.continent)
    //     .entries(data)

    // console.log(nestedCategory)
    // console.log(nestedContinent)

    console.log(data)

    const yValue = data.map(d => d.value)
    const xValue = data.map(d => d.category)
    const valueContinent = data.map(d => d.continent)

    const colorContinent = data => data.continent;

    // geef de vast margin - width - height
    var margin = {
        top: 20,
        right: 20,
        bottom: 95,
        left: 50
    };
    var width = 900;
    var height = 600;
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    //y-as schaal
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(yValue)])
        .range([height, 0])

    //x-as schaal
    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(xValue)
        .padding(0.2)
    //set domain for the x axis
    xScale.domain(data.map(function (d) {
        return d.category;
    }));
    //set domain for y axis
    yScale.domain([0, d3.max(data, function (d) {
        return +d.value;
    })]);

    //get the width of each bar 
    var barWidth = width / data.length;
    const chart = d3.select('svg')

    // const nestedCategory = d3.nest()
    //     .key(d => d.category)
    //     .entries(data)

    // console.log(nestedCategory)
    // nestedCategory = d3.stack()
    //     .y(d => d.value)
    //     .values(d => d.category)


    //select all bars on the graph, take them out, and exit the previous data set. 
    //then you can add/enter the new data set
    var bars = chart.selectAll(".bar")
        .remove()
        .exit()
        .data(data)
    //now actually give each rectangle the corresponding data
    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.category)) // dit geeft de aantaal arrays terug en plaatst het op de xas
        .attr("y", function (d) {
            return yScale(d.value);
        })
        .attr("height", function (d) {
            return height - yScale(d.value);
        })
        .attr("width", barWidth - 1)
        .attr('fill', d => color(colorContinent(d)))

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    //left axis
    //set up axes
    //left axis
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll('text')
        

    //bottom axis
    chart.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function (d) {
            return "rotate(-65)";
        });
    //add labels
    chart
        .append("text")
        .attr("transform", "translate(-35," + (height + margin.bottom) / 2 + ") rotate(-90)")
        .text("% of total watch time");

    chart
        .append("text")
        .attr("transform", "translate(" + (width / 2) + "," + (height + margin.bottom - 5) + ")")
        .text("categorie");

    // chart.append('text')
    //     .attr('class', 'label')
    //     .attr('x', -(height / 2) - margin)
    //     .attr('y', margin / 2.4)
    //     .attr('transform', 'rotate(-90)')
    //     .attr('text-anchor', 'middle')
    //     .text('Aantal in de collectie')
    //     .style('fill', 'grey')

    // chart.append('text')
    //     .attr('class', 'label')
    //     .attr('x', width / 2 + margin)
    //     .attr('y', height + margin * 1.7)
    //     .attr('text-anchor', 'middle')
    //     .text('categorie')
    //     .style('fill', 'grey')

    // chart.append('text')
    //     .attr('class', 'title')
    //     .attr('x', width / 2 + margin)
    //     .attr('y', 40)
    //     .attr('text-anchor', 'middle')
    //     .text('A picture is worth a thousand words')
    //     .style('fill', 'white')

}

function createVisual(results) {

    const yValue = results.map(d => d.value)
    const xValue = results.map(d => d.category)
    const valueContinent = results.map(d => d.continent)

    const colorContinent = results => results.continent;

    // selecteer de svg in de html bestand
    const svg = d3.select('svg');

    let nestResults = d3.nest()
        .key(d => d.category)
        .entries(results)

    console.log(nestResults)

    // geef de vast margin - width - height
    const margin = 100;
    const width = 1000 - 2 * margin;
    const height = 700 - 2 * margin;
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    //y-as schaal
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(yValue)])
        .range([height, 0])



    //x-as schaal
    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(xValue)
        .padding(0.2)

    const makeYLines = () => d3.axisLeft()
        .scale(yScale)

    // voeg een groep toe aan de svg (svg vormen)
    const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

    // Nieuwe groep, horizontale lijn x-as tekenen
    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    // Nieuwe groep, verticale lijn y-as tekenen
    chart.append('g')
        .call(d3.axisLeft(yScale));

    //grid maken op achtergrond bar chart
    chart.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
            .tickSize(-width, 0, 0)
            .tickFormat('')
        )


    const categoryBar = chart.selectAll()
        .data(results)
        .enter()
        .append('g')

    categoryBar
        .append('rect')
        .attr('class', 'bar')
        .attr('y', d => yScale(d.value))
        .attr('x', d => xScale(d.category))
        .attr('height', (g) => height - yScale(g.value))
        .attr('width', xScale.bandwidth())
        .style('fill', d => color(colorContinent(d)))

    // // de categorie barcanvas aanmaken
    // const categoryBar = chart.selectAll()
    //     .data(results)
    //     .enter()
    //     .append('g')

    // categoryBar
    //     .append('rect')
    //     .attr('class', 'bar')
    //     .attr('x', d => xScale(d.category))
    //     .attr('y', d => yScale(d.value))
    //     .attr('height', (g) => height - yScale(g.value))
    //      .attr('width', xScale.bandwidth())
    //     .style('fill', d => color(colorContinent(d)))

    // 	.on('mouseenter', function(){
    // 		d3.select(this)
    // 		.style("fill","lightblue")
    // 		.transition()
    // 		.duration(400)
    // 	})

    //     .on('mouseenter', function (actual, i, category) {
    //         d3.selectAll('.value')
    //             .attr('opacity', 0)

    //         d3.select(this)
    //             .transition()
    //             .duration(300)
    //             .attr('opacity', 0.6)
    //             .attr('x', (a) => xScale(a.category) - 5)
    //             .attr('width', xScale.bandwidth() + 10)

    //     const y = yScale(actual.value)

    // 		//toop tip voor het toevoegen van animaties

    //     const tooltip = d3.select("#tooltip")
    //         tooltip
    // 			.style("opacity", 1)

    // 		tooltip
    // 			.select("#range")				
    //             //.html((a.category) + "<br>" + "£" + (a.value));
    //             .text([
    //                 (actual.category) + (actual.value)
    //             ].join(" ")) //waardes meegeven aan de tooltip

    // 		// lijn aan de bovenkant die de muis volgt van Emma Oudmeijer
    //         line = chart.append('line')
    //             .attr('id', 'limit')
    //             .attr('x1', 0)
    //             .attr('y1', y)
    //             .attr('x2', width)
    // 			.attr('y2', y)

    //     })
    //     //hover loslaten , geen opacity
    //     .on('mouseleave', function () {

    //         d3.selectAll('.value')
    //             .attr('opacity', 0)

    //         d3.select(this)
    //             .transition()
    //             .duration(300)
    //             .attr('opacity', 1)
    //             .attr('x', (a) => xScale(a.category))
    //             .attr('width', xScale.bandwidth())
    //             .attr('transform', 'translate(0,3)' )

    //         chart.selectAll('#limit').remove()

    //         const tooltip = d3.select("#tooltip")
    //         tooltip
    //             .style("opacity", 0)
    // 	})

    // text voor de aantal producten
    // categoryBar
    // .append('text')
    // .attr('x', (a) => xScale(a.category) + xScale.bandwidth() / 2)
    // .attr('y', (a) => yScale(a.value) + 40)
    // .attr('text-anchor', 'middle')
    // .text((a) => `${a.value}`)

    // hier nest ik alle continenten bij elkaar
    const continentKey = d3.nest()
        .key(i => i.continent)
        .entries(results)
    //laatste value is overbodig van het continent weggehaald
    let newContinent = continentKey.pop()
    const newContinentValue = continentKey.map(i => i.key)

    console.log(continentKey)

    svg.append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Aantal in de collectie')
        .style('fill', 'grey')

    svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'middle')
        .text('categorie')
        .style('fill', 'grey')

    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('A picture is worth a thousand words')
        .style('fill', 'white')

}