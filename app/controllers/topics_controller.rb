class TopicsController < ApplicationController

  def index
    @topics = Topic.all
    render json: @topics
  end

  def show
    @topic = Topic.find(params[:id])
    render json: @topic.get_responses_json
  end

end
