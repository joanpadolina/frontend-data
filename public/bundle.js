(function () {
    'use strict';

    function queryModule (){ 
        return `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    
    SELECT ?type (COUNT(?cho) AS ?choCount) WHERE {
      VALUES ?type { "Foto" "foto" "Negatief" "negatief" "Glasnegatief" "glasnegatief" "Dia" "dia" "Kleurendia" "kleurendia" "Lichtbeeld" "lichtbeeld"}
      ?cho dc:type ?type ;
            dc:title ?title .
       FILTER langMatches(lang(?title), "ned")
    } GROUP BY ?type
    ORDER BY DESC(?choCount)
    `
    }

    const query = queryModule();
    const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-12/sparql";

    function fotoPerCategoryFetch() {
        fetch(url + "?query=" + encodeURIComponent(query) + "&format=json") //omzetten naar json en geschikt maken voor de het ophalen uit browser
            .then(data => data.json())
            .then(json => {
                console.log(json);
                const resultsQuery = json.results.bindings
                    .map(result => {

                        return {
                            category: result.type.value,
                            value: Number(result.choCount.value)
                        }
                    });
                createVisual(resultsQuery);
            });

    }
    fotoPerCategoryFetch();

    d3.format (".1%");



    function createVisual(results) {
        const svg = d3.select('svg');
        //hoe breed en hoe hoog wordt de visualisatie?
        const margin = 80;
        const width = 1000 - 2 * margin;
        const height = 600 - 2 * margin;

        const chart = svg.append('g')
            .attr('transform', `translate(${margin}, ${margin})`);


        //x-as schaal
        const xScale = d3.scaleBand()
            .range([0, width])
            .domain(results.map((s) => s.category))
            .padding(0.4);

        //console.log(results);
        //console.log(results.map((s) => s.category));

        //y-as schaal
        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 100040]);

        const makeYLines = () => d3.axisLeft()
            .scale(yScale);

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
            );
        // data aanroepen, versturen en groeperen
        const categoryBar = chart.selectAll()
            .data(results)
            .enter()
            .append('g');

        console.log(results);

        categoryBar
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (g) => xScale(g.category))
            .attr('y', (g) => yScale(g.value))
            .attr('height', (g) => height - yScale(g.value))
            .attr('width', xScale.bandwidth())
            //hover loslaten , geen opacity

            .on('mouseenter', function (actual, i, category) {
                d3.selectAll('.value')
                    .attr('opacity', 0); //weghalen van de bar

                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr('opacity', 0.6); //terugzetten van de bar transparant
                    // .attr('x', (a) => xScale(a.category) - 5)
                    // .attr('width', xScale.bandwidth() + 10)

                const y = yScale(actual.value);
                //nieuwe code
                const tooltip = d3.select("#tooltip");
                tooltip
                    .style("opacity", 1);

    			tooltip
    			// tijden het hover verschijnt er een lijn break
    				.select("#range")
    				
                    //.html((a.category) + "<br>" + "£" + (a.value));
                    .text([
                        (actual.category) + (actual.value)
                    ].join(" ")); //waardes meegeven aan de tooltip

                // LIJN BOVEN DE BAR CHARTS VOOR EEN DUIDELIJK OVERZICHT
                line = chart.append('line')
                    .attr('id', 'limit')
                    .attr('x1', 0)
                    .attr('y1', y)
                    .attr('x2', width)
                    .attr('y2', y);

            })
            //hover loslaten , geen opacity
            .on('mouseleave', function () {

                d3.selectAll('.value')
                    .attr('opacity', 1);

                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr('opacity', 1)
                    .attr('x', (a) => xScale(a.category))
                    .attr('width', xScale.bandwidth());

                chart.selectAll('#limit').remove();

                const tooltip = d3.select("#tooltip");
                tooltip
                    .style("opacity", 0);
            });

        categoryBar
            .append('text')
            .attr('x', (a) => xScale(a.category) + xScale.bandwidth() / 2)
            .attr('y', (a) => yScale(a.value) + 40)
            .attr('text-anchor', 'middle')
            .text((a) => `${a.value}`);

        svg
            .append('text')
            .attr('class', 'label')
            .attr('x', -(height / 2) - margin)
            .attr('y', margin / 2.4)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text('Aantal in de collectie');

        svg.append('text')
            .attr('class', 'label')
            .attr('x', width / 2 + margin)
            .attr('y', height + margin * 1.7)
            .attr('text-anchor', 'middle')
            .text('categorie');

        svg.append('text')
            .attr('class', 'title')
            .attr('x', width / 2 + margin)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text('A picture is wordt a thousand words');
    }

}());
