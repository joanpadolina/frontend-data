(function () {
    'use strict';

    function queryModule(){
        return `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
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
    }

    // Barchart data uit het Nederland Museum van Wereldculturen
    const query = queryModule();
    const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-12/sparql";

    // laurens omtoveren van de sparql query
    function fotoPerCategoryFetch() {
        fetch(url + "?query=" + encodeURIComponent(query) + "&format=json") //omzetten naar json en geschikt maken voor de het ophalen uit browser
            .then(data => data.json())
            .then(json => {
                const resultsQuery = json.results.bindings
                    .map(result => {

                        return {
                            category: result.type.value.toLowerCase(),
                            continent: result.continentLabel.value,
                            value: Number(result.choCount.value)

                        }
                    });

                createVisual(resultsQuery);
            });

    }
    fotoPerCategoryFetch();



    function createVisual(data) {

        // aangepaste kleuren
        function colorList() {
            return d3.scaleOrdinal(["#29A567", "#586BA4", "#ED4D6E", "#FAFFD8", "#AED9E0", "#FECCBA"])
        }
        let color = colorList();


        let yValue = data.map(d => d.value);
        let xValue = data.map(d => d.category);

        let svg = d3.select("svg"),
            margin = {
                top: 20,
                right: 50,
                bottom: 30,
                left: 100
            },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // https://bl.ocks.org/ADJMLyon/db038850d5890d6aff43c145591c6f90
        // data nesten/grouperen
        let nestedCategory = d3.nest()
            .key(d => d.category)
            .key(d => d.continent)
            .rollup(v => {
                return d3.sum(v, d => d.value)
            })
            .entries(data);

        // key namen uit de nesting vervangen
        nestedCategory.forEach(i => {
            i.category = i.key;
            delete i.key;

            i.values.forEach(d => {
                d.continent = d.key;
                d.totalValue = +d.value;


                delete d.key;
                delete d.value;
            });
            i.values.sort((a, b) => {
                return b.totalValue - a.totalValue
            });

        });


        // variabelen voor specifieke data
        let continentList = nestedCategory[0].values.map(d => d.continent).splice(0, 5); // laatste van de continent verwijderd ivm spelling.
        let categoryList = nestedCategory.map(d => d.category);
        console.log('Original data ', data);

        // x en y as wordt gemaakt

        let x0 = d3.scaleBand()
            .domain(categoryList)
            .rangeRound([0, width])
            .paddingInner(0.2);

        let x1 = d3.scaleBand()
            .domain(continentList).rangeRound([0, x0.bandwidth()])
            .padding(0.1);


        let y = d3.scaleLinear()
            .domain([0, d3.max(nestedCategory, d => {
                return d3.max(d.values, el => {
                    return el.totalValue
                })
            })])
            .rangeRound([height, 0]);

        let z = d3.scaleOrdinal()
            .domain(continentList)
            .range(["#29A567", "#586BA4", "#ED4D6E", "#AED9E0", "#FECCBA"]);

        // één grote groep aan maken
        let category = g.append('g')
            .selectAll('g')
            .data(nestedCategory);

        // binnen de grote groep 5 subgroepen
        let categoryEnter = category
            .enter()
            .append('g')
            .attr('transform', d => {
                return `translate(${x0(d.category)},0)`
            })
            .attr('class', 'category');

        // rechthoeken en de data
        let rect = categoryEnter.selectAll('rect')
            .data(d => d.values);

        let rectEnter = rect
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('y', height)
            .attr('width', x0.bandwidth())
            .attr('height', 0);


        // in de subgroepen rechthoeken maken van 5 continenten per subgroep
        let groupBar = () => {
            rectEnter.transition()
                .duration(500)
                .delay((d, i) => {
                    return i * 10;
                })
                .attr('class', 'group-bar')
                .attr('x', d => x1(d.continent))
                .attr('y', (d) => y(d.totalValue))
                .attr('witdh', x0.bandwidth())
                .attr('height', d => height - y(d.totalValue))
                .attr('fill', d => z(d.continent));
            rectEnter.exit().remove();
        };
        // groupBar.exit().remove()

        // hier maak ik een dropdown keuze menu van de continenten die in de database staan
        let dropdown = d3.select('body')
            .append('select')
            .attr('id', 'filter');

        dropdown
            .selectAll('option')
            .data(continentList)
            .enter()
            .append('option')
            .text(d => d)
            .attr('value', d => d);

        // dropdown update begint hier
        function updateData() {

            // dropdown selectie 
            const selectedContinent = this.value;

            console.log(selectedContinent);

            // nieuwe data opzet 
            let continentUpdate = data.filter(row => row.continent === selectedContinent);
            let beauty = d3.nest()
                .key(d => d.category)
                .key(d => d.continent)
                .rollup(v => {
                    return d3.sum(v, d => d.value)
                })
                .entries(continentUpdate);

            beauty.map(i => {
                i.category = i.key;

                delete i.key;
                i.values.map(d => {
                    d.continent = d.key;

                    delete d.key;

                });
            });
            console.log(beauty);

            // update x en y as    
            x1
                .domain(continentList)
                .padding(0.05);

            y
                .domain(d3.extent(beauty.map(d => d.values[0].value)))
                .range([height, 0]);

            let yAxis = d3.axisLeft(y);


            svg.selectAll("g.yaxis")
                .transition()
                .duration(1300)
                .call(yAxis);



            if (this.value) {
                const bars = d3.select('g')
                    .selectAll('.group-bar')
                    .data(beauty);


                bars
                    .transition()
                    .duration(600)
                    .attr('x', d => x0(d.category))
                    .attr('y', d => y(d.values[0].value))
                    .attr('width', x0.bandwidth())
                    .attr('height', d => height - y(d.values[0].value))
                    .attr('fill', d => z(this.value));

                bars.exit().remove();


            } else groupBar();


            d3.selectAll('rect')
                .on('mouseover', toolOn)
                .on('mouseexit', toolOf);



            // functie voor de tooltip
            // https://bl.ocks.org/d3noob/257c360b3650b9f0a52dd8257d7a2d73

            // tool tip geeft informatie bij mouseover/mouseout
            function toolOn(d) {
                div.transition()
                    .duration(200)
                    .style('opacity', .9);

                div.html(`${d.values[0].continent} <br><hr> ${d.values[0].value}`)
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 20) + 'px');

                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr('fill', 'orange');
            }

            // wat er gebeurt als je weer weg gaat met de muis
            function toolOf(d) {
                div.transition()
                    .duration(500)
                    .style('opacity', 0);

                d3.select(this)
                    .transition()
                    .duration(500);
            }

        }

        d3.selectAll('#filter')
            .on('change', updateData);

        // legenda uit de data
        let continentLegend = (data) => {
            var legend = g.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "end")
                .selectAll("g")
                .data(data)
                .enter()
                .append("g")
                .attr("transform", (d, i) => {
                    return "translate(0," + i * 25 + ")";
                });

            legend.append("rect")
                .attr("x", width - 19)
                .attr("width", 10)
                .attr("height", 19)
                .attr("fill", z);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .attr('fill', 'darkgray')
                .text(d => {
                    return d;
                });
        };


        //https://stackoverflow.com/questions/41549713/d3-js-i-want-to-change-the-data-value-to-a-percentage
        //de Y-ass veranderen naar een percentage
        // let leftAxis = d3.axisLeft(y)
        //     .tickFormat(d => Math.round(d * 100 / d3.max(y.domain())) + "%")

        //Axis voor de chart
        let drawAxis = () => {
            g.append('g')
                .attr('class', 'xaxis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(x0));

            g.append('g')
                .attr('class', 'yaxis')
                .call(d3.axisLeft(y))
                .append('text')
                .attr('x', 2)
                .attr('y', y(y.ticks().pop()) + 0.5)
                .attr('dy', '1.32em')
                .attr('fill', '#000')
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'start')
                .attr('transform', 'rotate(90)translate(140, 60)')
                .text('aantal verzameld');
        };

        // aanroepen van de functies
        groupBar();
        continentLegend(continentList);
        drawAxis();



        // van groep naar stacked
        d3.selectAll('input').on('change', change);


        let timeout = setTimeout(() => {
            d3.select('input[value=\'grouped\']').property('checked', true).each(change);
        }, 400);


        function change() {
            clearTimeout(timeout);
            if (this.value === 'grouped') transitionGrouped();
            else transitionStacked();
        }

        function transitionGrouped() {

            rectEnter.transition()
                .duration(500)
                .delay((d, i) => {
                    return i * 10;
                })
                .attr('x', d => {
                    return x1(d.continent);
                })
                .attr('width', x1.bandwidth())
                .transition()
                .attr('y', d => {
                    return y(d.totalValue);
                })
                .attr('height', d => {
                    return height - y(d.totalValue);
                });
        }

        function transitionStacked() {

            rectEnter.transition()
                .duration(500)
                .delay((d, i) => {
                    return i * 10;
                })
                .attr('y', d => {
                    return y(d.totalValue);
                })
                .attr('height', d => {
                    return height - y(d.totalValue);
                })
                .transition()
                .attr('x', d => {
                    return x0(d.continent);
                })
                .attr('width', x0.bandwidth());
        }

        // tool tip in de html plaatsen
        let div = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);


        // tooltip activeren
        categoryEnter.selectAll('rect')
            .on('mouseover', toolOn)
            .on('mouseout', toolOf);

        // wat er gebeurt als je over de rectagles overheen gaat
        function toolOn(d) {
            div.transition()
                .duration(200)
                .style('opacity', .9);
            div.html(`${d.continent} <br><hr> ${d.totalValue}`)
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 20) + 'px');
            d3.select(this)
                .transition()
                .duration(300)
                // .attr('width', x1.bandwidth() + 3)
                .attr('fill', 'orange');
        }

        // wat er gebeurt als je weer weg gaat met de muis
        function toolOf(d) {
            div.transition()
                .duration(500)
                .style('opacity', 0);
            d3.select(this)
                .transition()
                .duration(500)
                .attr('fill', d => z(d.continent));
            // .attr('width', x1.bandwidth())
        }
    }

}());
