(function () {
    'use strict';

    let data = [{
            'category': 'foto',
            'continent': 'Azië',
            'value': 68656
        },
        {
            'category': 'foto',
            'continent': 'Azië',
            'value': 23763
        },
        {
            'category': 'negatief',
            'continent': "Azië",
            "value": 17367
        },
        {
            "category": "dia",
            "continent": "Azië",
            "value": 14699
        },
        {
            "category": "negatief",
            "continent": "Amerika",
            "value": 9869
        },
        {
            "category": "lichtbeeld",
            "continent": "Azië",
            "value": 8968
        },
        {
            "category": "dia",
            "continent": "Amerika",
            "value": 6902
        },
        {
            "category": "foto",
            "continent": "Eurazië",
            "value": 5899
        },
        {
            "category": "kleurendia",
            "continent": "Amerika",
            "value": 5577
        },
        {
            "category": "negatief",
            "continent": "Azië",
            "value": 5448
        },
        {
            "category": "negatief",
            "continent": "Afrika",
            "value": 4692
        },
        {
            "category": "foto",
            "continent": "Amerika",
            "value": 4470
        },
        {
            "category": "glasnegatief",
            "continent": "Azië",
            "value": 4259
        },
        {
            "category": "foto",
            "continent": "Amerika",
            "value": 3653
        },
        {
            "category": "kleurendia",
            "continent": "Oceanië",
            "value": 3453
        },
        {
            "category": "dia",
            "continent": "Amerika",
            "value": 2043
        },
        {
            "category": "foto",
            "continent": "Afrika",
            "value": 1853
        },
        {
            "category": "foto",
            "continent": "Oceanië",
            "value": 1796
        },
        {
            "category": "lichtbeeld",
            "continent": "Azië",
            "value": 1716
        },
        {
            "category": "dia",
            "continent": "Afrika",
            "value": 1576
        },
        {
            "category": "foto",
            "continent": "Eurazië",
            "value": 1334
        },
        {
            "category": "dia",
            "continent": "Oceanië",
            "value": 1258
        },
        {
            "category": "glasnegatief",
            "continent": "Amerika",
            "value": 1059
        },
        {
            "category": "foto",
            "continent": "Afrika",
            "value": 1041
        },
        {
            "category": "negatief",
            "continent": "Oceanië",
            "value": 893
        },
        {
            "category": "negatief",
            "continent": "Eurazië",
            "value": 829
        },
        {
            "category": "foto",
            "continent": "Oceanië",
            "value": 814
        },
        {
            "category": "lichtbeeld",
            "continent": "Afrika",
            "value": 791
        },
        {
            "category": "dia",
            "continent": "Azië",
            "value": 773
        },
        {
            "category": "dia",
            "continent": "Eurazië",
            "value": 731
        },
        {
            "category": "glasnegatief",
            "continent": "Eurazië",
            "value": 584
        },
        {
            "category": "dia",
            "continent": "Afrika",
            "value": 345
        },
        {
            "category": "lichtbeeld",
            "continent": "Amerika",
            "value": 324
        },
        {
            "category": "negatief",
            "continent": "Amerika",
            "value": 94
        },
        {
            "category": "negatief",
            "continent": "Eurazië",
            "value": 78
        },
        {
            "category": "kleurendia",
            "continent": "Afrika",
            "value": 65
        },
        {
            "category": "negatief",
            "continent": "Afrika",
            "value": 47
        },
        {
            "category": "dia",
            "continent": "Eurazië",
            "value": 31
        },
        {
            "category": "lichtbeeld",
            "continent": "Eurazië",
            "value": 26
        },
        {
            "category": "negatief",
            "continent": "Oceanen",
            "value": 26
        },
        {
            "category": "kleurendia",
            "continent": "Azië",
            "value": 22
        },
        {
            "category": "glasnegatief",
            "continent": "Afrika",
            "value": 22
        },
        {
            "category": "foto",
            "continent": "Oceanen",
            "value": 15
        },
        {
            "category": "glasnegatief",
            "continent": "Eurazië",
            "value": 11
        },
        {
            "category": "glasnegatief",
            "continent": "Azië",
            "value": 10
        },
        {
            "category": "kleurendia",
            "continent": "Azië",
            "value": 6
        },
        {
            "category": "kleurendia",
            "continent": "Amerika",
            "value": 3
        },
        {
            "category": "lichtbeeld",
            "continent": "Amerika",
            "value": 2
        },
        {
            "category": "negatief",
            "continent": "Oceanië",
            "value": 2
        },
        {
            "category": "kleurendia",
            "continent": "Oceanië",
            "value": 1
        },
        {
            "category": "dia",
            "continent": "Oceanië",
            "value": 1
        },
        {
            "category": "glasnegatief",
            "continent": "Oceanië",
            "value": 1
        }
    ];


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
    // nesting my data
    let nestedCategory = d3.nest()
        .key(d => d.category)
        .key(d => d.continent)
        .rollup(v => {
            return d3.sum(v, d => d.value)
        })
        .entries(data);

    // hier verander ik de namen van de data zodat ik er een beter overzicht heb dan keys gebruiken
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


    // geeft een naam voor bepaalde waardes om dit makkelijker te achterhalen
    let continentList = nestedCategory[0].values.map(d => d.continent).splice(0, 5); // laatste van de continent verwijderd ivm spelling.
    let categoryList = nestedCategory.map(d => d.category);
    console.log(continentList);
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


    let category = g.append('g')
        .selectAll('g')
        .data(nestedCategory);

    let categoryEnter = category
        .enter()
        .append('g')
        .attr('transform', d => {
            return `translate(${x0(d.category)},0)`
        })
        .attr('class', 'category');

    let rect = categoryEnter.selectAll('rect')
        .data(d => d.values);

    let rectEnter = rect
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('y', height)
        .attr('width', x0.bandwidth())
        .attr('height', 0);


    // de chart begint met een groep per category
    let groupBar = () => {
        rectEnter.transition()
            // .duration(500)
            // .delay((d, i) => {
            //     return i * 10;
            // })
            .attr('class', 'group-bar')
            .attr('x', d => x1(d.continent))
            .attr('y', (d) => y(d.totalValue))
            .attr('witdh', x0.bandwidth())
            .attr('height', d => height - y(d.totalValue))
            .attr('fill', d => z(d.continent));
    };

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

    let showAll = d3.select('body')
        .append('button')
        .attr('value', 'alles')
        .enter()
        .text('Laat alles zien');


    // trying to update the data
    // update succes

    function updateData() {


        const selectedContinent = this.value;

        console.log(selectedContinent);
        let test = data.filter(row => row.continent === selectedContinent);
        let beauty = d3.nest()
            .key(d => d.category)
            .key(d => d.continent)
            .rollup(v => {
                return d3.sum(v, d => d.value)
            })
            .entries(test);

        beauty.map(i => {
            i.category = i.key;

            delete i.key;
            i.values.map(d => {
                d.continent = d.key;

                delete d.key;

            });
        });
        console.log(beauty);


        x1
            .domain(continentList)
            .padding(0.05);

        y
            .domain(d3.extent(beauty.map(d => d.values[0].value)))
            .range([height, 0]);

        z
            .domain(continentList)
            .range(["#29A567", "#586BA4", "#ED4D6E", "#AED9E0", "#FECCBA"]);

        console.log(z.domain());
        let yAxis = d3.axisLeft(y);

        svg.selectAll("g.yaxis")
            .call(yAxis);


        if (this.value) {
            d3.select('g').selectAll('.group-bar')
                .data(beauty)
                .attr('x', d => x0(d.category))
                .attr('y', d => y(d.values[0].value))
                .attr('width', x0.bandwidth())
                .attr('height', d => height - y(d.values[0].value))
                .attr('fill', d => z(this.value))
                .exit().remove();

        } else groupBar();


        d3.selectAll('rect')
            .on('mouseover', toolOn)
            .on('mouseexit', toolOf);

        // wat er gebeurt als je over de rectagles overheen gaat
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
                .attr('width', x0.bandwidth())
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
                .attr('fill', d => z(d.continent))
                .attr('width', x0.bandwidth());
        }
        //Update all rects
        svg.selectAll("rect")
            .data(beauty)
            .transition()
            .delay(function (d, i) {
                return i * 100;
            })
            .duration(1000)
            .ease(d3.easeBounceOut)
            .attr("y", function (d) {
                return h - y(d);
            })
            .attr("height", function (d) {
                return y(d);
            })
            .attr("fill", function (d) {
                return "rgb(0,0," + Math.round(d * 10) + ")";
            });

    }

    d3.selectAll('#filter').on('change', updateData);

    // legenda uit de data
    let continentLegend = (data) => {
        let legend = g.append("g")
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
            .attr("width", 20)
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
    // d3.selectAll('input').on('change', change);


    // let timeout = setTimeout(() => {
    //     d3.select('input[value=\'grouped\']').property('checked', true).each(change);
    // }, 400);


    // function change() {
    //     clearTimeout(timeout);
    //     if (this.value === 'grouped') transitionGrouped();
    //     else transitionStacked();
    // }

    // function transitionGrouped() {

    //     rectEnter.transition()
    //         .duration(500)
    //         .delay((d, i) => {
    //             return i * 10;
    //         })
    //         .attr('x', d => {
    //             return x1(d.continent);
    //         })
    //         .attr('width', x1.bandwidth())
    //         .transition()
    //         .attr('y', d => {
    //             return y(d.totalValue);
    //         })
    //         .attr('height', d => {
    //             return height - y(d.totalValue);
    //         });
    // }

    // function transitionStacked() {

    //     rectEnter.transition()
    //         .duration(500)
    //         .delay((d, i) => {
    //             return i * 10;
    //         })
    //         .attr('y', d => {
    //             return y(d.totalValue);
    //         })
    //         .attr('height', d => {
    //             return height - y(d.totalValue);
    //         })
    //         .transition()
    //         .attr('x', d => {
    //             return x0(d.continent);
    //         })
    //         .attr('width', x0.bandwidth());
    // }

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
            .attr('fill', d => z(d.continent))
            .attr('width', x1.bandwidth());
    }

    svg.append('text')
        .append('h1')
        .attr('class', 'title')
        .attr('x', 40)
        .attr('y', -20)
        .attr('text-anchor', 'middle')
        .text('A picture is worth a thousand words')
        .style('fill', '#e94e55');

}());
