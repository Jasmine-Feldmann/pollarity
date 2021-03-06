var TopicChartsView = Backbone.View.extend({

  initialize: function() {
    this.$el = $("#charts-container");
    this.template = JST["templates/topic-charts/topicChartsTemplate"];
  },

  render: function() {
    this.$el.html(this.template({ charts: this.collection }));

    // this condition handles the display of the charts for Obama Job Approval.
    if (this.collection[0].collection.options.topicId == 1) {
      drawDatamap(this.collection[0].attributes[0]);
      // display map legend
      this.$el.find("#first-chart-container").append(JST["templates/topic-charts/map-legend-template"]);

      $("#line-graph-container").hide();
      $("#bar-graph-container").hide();
      var timeSlider = new TimeSlider();
      timeSlider.render();
      this.$el.find("#slider").on("slide", this.updateChartData.bind(this));
      this.$el.find(".ui-tabs-panel").on("click", this.toggleTab)

      // initiate the trends line graph
      var bindToThis = this;
      $("#trends-tab").on("click", function () {
        $("#line-graph").remove();
        $("#approval-scatter").remove();
        $('<svg class="graph" id="line-graph" width="1000" height="500"></svg>').appendTo("#line-graph-container");
        choiceLineGraph(_.values(bindToThis.collection[1].attributes));
        $('<svg class="graph" id="approval-scatter" width="1000" height="600"></svg>').appendTo("#line-graph-container");
        drawApprovalScatterPlot();
      })
      // handle tab toggling
      $(".ui-tabs-panel:not(#trends-tab)").on("click", function() {
        $("#line-graph").remove()
      });

      // initiate the prediction line graph
      $("#predictions-tab").on("click", function() {
        $('<svg class="graph" id="prediction-graph" width="1000" height="500"></svg>').appendTo("#prediction-graph-container");
        predictionLineGraph(PREDICTIONDATA);
      });
      // handle tab toggling
      $(".ui-tabs-panel:not(#predictions-tab").on("click", function() {
        $("#prediction-graph").remove();
      })

    }
    else {
      $("#predictions-tab").hide();
      $("#line-graph-container").hide();
      // Hackily extract the chart title from the topic selector dropdown so it can be displayed on the chart.
      var chartTitle = $('#topics-dropdown').children()[$('#topics-dropdown').val()].innerText;
      initBarChart(this.collection, chartTitle);
      var viewToBind = this;

      //reanimates line graph on tab click
      $("#trends-tab").on("click", function () {
        $("#line-graph").remove();
        $('<svg class="graph" id="line-graph" width="1000" height="500"></svg>').appendTo("#line-graph-container");
        choiceLineGraph(viewToBind.collection);
      });
      $(".ui-tabs-panel:not(#trends-tab)").on("click", function() {
        $("#line-graph").remove()
      });
      //reanimates bar graph on tab click
      $("#chart-tab").on("click", function() {
        $('<svg class="graph" id="bar-graph" width="1000" height="500"></svg>').appendTo("#bar-graph-container");
        initBarChart(viewToBind.collection, chartTitle);
      })
      $(".ui-tabs-panel:not(#chart-tab)").on("click", function() {
        $("#bar-graph").remove()
      });

      this.$el.find(".ui-tabs-panel").on("click", this.toggleTab)
    }
  },

  updateChartData: function(event, ui) {
    var scroll = $(window).scrollTop();
    $("#map-container").html("");
    drawDatamap(this.collection[0].attributes[30 - ui.value]);
    $(window).scrollTop(scroll);
  },

  toggleTab: function(event, ui) {
    event.preventDefault();
    $("div ul a li").removeClass("active");
    $(".charts").hide()
    var link = $(this.parentElement).attr("href")
    $(this).addClass("active");
    $(link).show();
  }

})
