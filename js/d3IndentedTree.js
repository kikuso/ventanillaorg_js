window.onload = function(){
	console.log("Executing window.onload");
	//Recuperando JSON 
	var file = "../dataJson/dataCpAndResult.json";
	//console.log("Recuperando JSON..." + file);
	var data = JSON.parse(jotason); //require('../dataJson/test.json'); //with path
	console.log("JSON Data length: " + data.length);
	//console.log(data[0].timeMean);
	
	/**********************************
	 * 	 GRAPH TIEMPO 
	 **********************************/
	/*
	max = -99999;
	for(i = 0; i < data.length; i++){
		if (data[i].timeMean >= max){
			//console.log("New max = " + data[i].tiempo)
			max = data[i].timeMean;
		}
	}
	console.log("Tiempo Max: " + max);
	
	var x = d3.scale.linear()
		.domain([0, max])
		.range([0, 900]);
	
	
	d3.select(".cpTimes")
		.selectAll("div")
		.data(data)
		.enter()
		.append("div")
		.text(function(d){return "CP:" + d.cp + ":" + d.timeMean;})
		.style("width", function(d){return x(d.timeMean)+"px";})
		
		*/
	/******************************************
	 * 			EXAMPLE ORDERED VALUES
	 ******************************************/	
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;
	
	//var formatPercent = d3.format(".0%");
	var format = d3.format("04d");
	
	
	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1, 1);
	var y = d3.scale.linear()
	    .range([height, 0]);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
	xAxis.tickValues(data.map(function(d,i){
		if(i%10==0) return d.cp;
		})
		.filter(function(d){
			return !!d;
		})	
		);
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(format);
	
	
	//SVG general que contiene el resto de cosas
	var svg = d3.select("body")
		.append("svg")
	    	.attr("width", width + margin.left + margin.right)
	    	.attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	
	  x.domain(data.map(function(d) { return d.cp; }));
	  //x.domain([d3.min(data, function(d){return d.cp;}), d3.max(data, function(d) { return d.cp; })]);
	 //x.domain(_.range(Math.min(data.cp), Math.max(data.cp)));
	  
	  y.domain([0, d3.max(data, function(d) { return d.timeMean; })]);
	
	
	 //Crear el X axis
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      //.attr("transform", "translate(0,0)")
	      .call(xAxis);
	
	  //Crear el Y Axis -> rota el texto!
	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", "0.71em")
	      .style("text-anchor", "end")
	      .text("Mean time");
	
	 
	  svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.cp); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.timeMean); })
	      .attr("height", function(d) { return height - y(d.timeMean); });
	
	  d3.select("input").on("change", change);
	
	  var sortTimeout = setTimeout(function() {
	    d3.select("input").property("checked", true).each(change);
	  }, 2000);
	
	  function change() {
	    clearTimeout(sortTimeout);
	
	    // Copy-on-write since tweens are evaluated after a delay.
	    var x0 = x.domain(data.sort(this.checked
	        ? function(a, b) { return b.timeMean - a.timeMean; }
	        : function(a, b) { return d3.ascending(a.cp, b.cp); })
	        .map(function(d) { return d.cp; }))
	        .copy();
	
	    svg.selectAll(".bar")
	        .sort(function(a, b) { return x0(a.cp) - x0(b.cp); });
	
	    var transition = svg.transition().duration(750),
	        delay = function(d, i) { return i * 50; };
	
	    transition.selectAll(".bar")
	        .delay(delay)
	        .attr("x", function(d) { return x0(d.cp); });
	
	    transition.select(".x.axis")
	        .call(xAxis)
	      .selectAll("g")
	        .delay(delay);
	  }

	
};


