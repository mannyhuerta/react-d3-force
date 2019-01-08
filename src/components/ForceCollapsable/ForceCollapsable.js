import React, { Component } from 'react'
import { withFauxDOM } from 'react-faux-dom'
import './styles.css'
import { event as currentEvent } from 'd3-selection';
const d3 = {
    ...require('d3-drag'),
    ...require('d3-force'),
    ...require('d3-selection'),
    ...require('d3-hierarchy')

}

class ForceCollapsable extends Component {
    componentDidMount() {
        this.renderD3()
    }
    render() {
        const { chart } = this.props
        return <div>{chart}</div>
    }
    renderD3() {
        const {
            onChange,
            connectFauxDOM,
            animateFauxDOM
        } = this.props
        const width = 1200
        const height = 800
        let faux = connectFauxDOM('div', 'chart')

        // const data = require('./lesmis.json')
        const data = require('./flare.json')
        const root = d3.hierarchy(data)
        const nodes = root.descendants()
        const links = root.links()

        const svg = d3.select(faux).append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('position', 'absolute')
            .append('g')


        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line");

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", function (d) { console.log(d); return d.children ? 5 : Math.sqrt(d.data.size) / 10 })

            .on('mouseover', function d(d) { onChange(nodes[d.index].id); })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function (d) { return d.id; });

        simulation
            .nodes(nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(links);

        function ticked() {
            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
        }

        function dragstarted(d) {
            if (!currentEvent.active) simulation.alphaTarget(0.3).restart();
            animateFauxDOM(10000)
            d.fx = d.x
            d.fy = d.y

        }

        function dragged(d) {
            d.fx = currentEvent.sourceEvent.x
            d.fy = currentEvent.sourceEvent.y
        }

        function dragended(d) {
            if (!currentEvent.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
            animateFauxDOM(10000)
        }

        animateFauxDOM(10000)
    }
}

export default withFauxDOM(ForceCollapsable)
