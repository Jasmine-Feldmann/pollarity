var AppRouter = Backbone.Router.extend({
  routes: {
    'topics/:topicId': 'showResults',

    '*actions': 'defaultAction'
  },


  showResults: function(topicId) {
    if ($('#topics-container').length === 0) {
      this.defaultAction();
    }
    var resultsView = new ResultsView();
    resultsView.render();
    var topicCharts = new TopicCharts([], { topicId: topicId });
    topicCharts.fetch({
      success: function(response) {
        var topicChartsView = new TopicChartsView({ collection: response.models });
        topicChartsView.render();
        // Ensure that the correct option is displayed as 'selected' in the dropdown.
        $('option:nth-child(' + (parseInt(topicId)+1) + ')').attr('selected', true);
      }
    });
  },

  defaultAction: function() {
    var homeView = new HomeView();
    homeView.render();
    $('#topics-container').on('change', '#topics-dropdown', function(event) {
      var targetVal = event.target.value;
      if (targetVal.length > 0) {
        this.navigate("topics/" + targetVal, { trigger: true });
      }
    }.bind(this));
  }

});
