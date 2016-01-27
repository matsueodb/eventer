# coding: utf-8
require 'net/http'
require 'uri'
require 'json'

class EventsController < ApplicationController
  before_action :set_event, only: [:show, :edit, :update, :destroy]
  layout 'events'
  respond_to :html

  def map
    @events = Event.all
    render :json => @events
  end

  def index
    @events = Event.all
    respond_with(@events)
  end

  def opendata_list
    url = URI.parse('http://192.168.99.2')
    res = Net::HTTP.start(url.host,url.port) do|http|
      #82:「全般」の相談・教室
      http.get('/api/records/82')
    end

    data = JSON.load(res.body)
    datas = data['results']
    @events = []
    datas.each do |data|
      event = {}
      address = ''
      address << data['都道府県'] if data['都道府県']
      address << data['市区町村'] if data['市区町村']
      address << data['町名'] if data['町名']
      address << data['丁目'].to_s + "丁目" if data['丁目']
      address << data['番地'].to_s + "番地" if data['番地']
      address << data['号'].to_s + "号" if data['号']
      event[:address] = address
      event[:place_name] = data['場所']
      event[:start_date] = data['開催日']
      event[:title] = data['名称']
      event[:summary] = data['内容']
      @events << event
    end
    url = URI.parse('http://maps.googleapis.com')

    @events.each do |event|
      res = Net::HTTP.start(url.host,url.port) do|http|
        http.get("/maps/api/geocode/json?address=#{event[:address]}")
      end
      data = JSON.load(res.body)
      if data['status'] == "OK"
        location =  data['results'][0]['geometry']['location']
        event[:lat] = location['lat']
        event[:lng] = location['lng']
      else
        event[:lat] = nil
        event[:lng] = nil
      end
    end
  end

  def comment
    lat = params[:lat]
    lng = params[:lng]
    rad = params[:rad]
    start_date = params[:start_date]
    end_date = params[:end_date]
    tags = params[:tags] ? params[:tags] : ""
    if tags == ""
      tag_id = TagCollection.all.select(:id).collect{|t| t.id}
    else
      tags =  tags.split(',')
      tag_id = TagCollection.select(:id).where(name: tags).collect{|t| t.id}
    end
    @events = Event.find_by_area(lat,lng,rad,start_date,end_date)
    @events = @events.select do |e|
       tags = e.tags.collect { |t| t.tag_collection_id}
       tags.any?{|t| tag_id.include?(t)}
    end
    p params
    render  :jbuilder => @events
  end

  def show
    respond_to do |format|
      format.json {render :jbuilder => @events}
      format.html {render :layout => 'application'}
    end
  end

  def new
    @event = Event.new
    if params[:title]
      para = params.permit(:title, :summary, :place_name, :lat, :lng, :address)
      @event = Event.new(para)
      if params[:start_date]
        @event.start_date = @event.end_date =
          DateTime.parse(params[:start_date])
      end
    end
    render :layout => 'event_regist'
    #respond_with(@event)
  end

  def edit
    render :layout => 'application'
  end

  def create
    @event = Event.new(event_params)
    @event.save
    params[:tags].each do |k,v|
      if v == "1"
        t = Tag.new
        p t
        t.event_id = @event.id
        t.tag_collection_id = k
        t.save
      end
    end
    respond_with(@event)
  end

  def update
    @event.update(event_params)
    t = Tag.where(event_id: @event.id)
    t.each{|r| r.delete }
    params[:tags].each do |k,v|
      if v == "1"
        t = Tag.new
        t.event_id = @event.id
        t.tag_collection_id = k
        t.save
      end
    end

    respond_with(@event)
  end

  def destroy
    @event.destroy
    respond_with(@event)
  end

  private
    def set_event
      @event = Event.find(params[:id])
    end

    def event_params
      params.require(:event).permit(:title, :summary, :place_name, :lat, :lng, :start_date, :end_date, :tag_id, :rad, :address, :url, :tags)
    end
end
