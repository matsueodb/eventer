json.array!(@events) do |event|
  comments = event.comments
  tags = event.tags
  json.extract! event, :id, :title, :summary, :place_name, :lat, :lng, :start_date, :end_date, :tag_id, :address
  json.comment comments, :value
  json.tags tags, :tag_collection_id
#  json.url event_url(event, format: :json)
end
