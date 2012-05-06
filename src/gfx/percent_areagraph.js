r3.percent_areagraph = function (graphdef) {
	r3.graph.call(this, graphdef);
	graphdef.stepup = 'percent';
	this.init(graphdef);

	stacklayout = d3.layout.stack().offset('zero')(
		this.categories.map(function (d) {
			return graphdef.dataset[d].map(function (d) {
				return {x: d.name, y: +d.value};
			});
		})
	);

	var areagroup, areapath, areafunc,
		domainData = this.labels, 
		categories = this.categories;

	this.axes[this.graphdef.orientation === 'hor' ? 'ver' : 'hor'].scale.domain(domainData.map(function (d) { return d; }));
	this.areagroup = this.panel.selectAll('g.areagroup').data(stacklayout).enter().append('g').attr('class', 'areagroup');
	this['draw' + r3.util.getPascalCasedName(this.graphdef.orientation) + 'StackArea']();

	this.finalize();
};

r3.percent_areagraph.prototype = r3.util.extend(r3.graph);

r3.percent_areagraph.prototype.drawHorStackArea = function () {
	var axes = this.axes,
		categories = this.categories,
		config = this.config,
		sumMap = r3.util.getSumUpArray(this.graphdef);
	
	axes.ver.scale.rangePoints([0, this.height()]);

	this.areapath = this.areagroup.append('path')
					    .attr('class', function (d, i) { return 'areapath_' + categories[i]; })
					    .style('fill', function (d, i) { return r3.util.getColorBand(config, i); })
					    .attr('d', d3.svg.area()
						    .y(function (d) { return axes.ver.scale(d.x) + axes.ver.scale.rangeBand() / 2; })
						    .x0(function (d, i) { return axes.hor.scale(r3.util.getPercentage(d.y0, sumMap[i])); })
						    .x1(function (d, i) { return axes.hor.scale(r3.util.getPercentage(d.y0 + d.y, sumMap[i])); })
						)
						.on('mouseover', function () {d3.select(this).style('fill', r3.config.effects.hovercolor); })
						.on('mouseout',  function (d, i) {d3.select(this).style('fill', r3.util.getColorBand(config, i)); });

	this.linepath = this.areagroup.append('path')
						.attr('class', function (d, i) { return 'linepath_' + categories[i]; })
						.style('stroke', 'white').style('fill', 'none').style('stroke-width', 2)
						.attr('d', d3.svg.line()
						    .y(function (d) { return axes.ver.scale(d.x) + axes.ver.scale.rangeBand() / 2; })
						    .x(function (d, i) { return axes.hor.scale(r3.util.getPercentage(d.y0 + d.y, sumMap[i])); })
						);
};

r3.percent_areagraph.prototype.drawVerStackArea = function () {
	var axes = this.axes,
		categories = this.categories,
		config = this.config,
		sumMap = r3.util.getSumUpArray(this.graphdef);
	
	axes.hor.scale.rangePoints([0, this.width()]);

	this.areapath = this.areagroup.append('path')
					    .attr('class', function (d, i) { return 'areapath_' + categories[i]; })
					    .style('fill', function (d, i) { return r3.util.getColorBand(config, i); })
					    .attr('d', d3.svg.area()
						    .x(function (d) { return axes.hor.scale(d.x) + axes.hor.scale.rangeBand() / 2; })
						    .y0(function (d, i) { return axes.ver.scale(r3.util.getPercentage(d.y0, sumMap[i])); })
						    .y1(function (d, i) { return axes.ver.scale(r3.util.getPercentage(d.y0 + d.y, sumMap[i])); })
					    )
						.on('mouseover', function () {d3.select(this).style('fill', r3.config.effects.hovercolor); })
						.on('mouseout',  function (d, i) {d3.select(this).style('fill', r3.util.getColorBand(config, i)); });

	this.linepath = this.areagroup.append('path')
					    .attr('class', function (d, i) { return 'linepath_' + categories[i]; })
					    .style('stroke', 'white').style('fill', 'none').style('stroke-width', 2)
					    .attr('d', d3.svg.line()
						    .x(function (d, i) { return axes.hor.scale(d.x) + axes.hor.scale.rangeBand() / 2; })
						    .y(function (d, i) { return axes.ver.scale(r3.util.getPercentage(d.y0 + d.y, sumMap[i])); })
					    );
};