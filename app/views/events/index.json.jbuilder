json.array!(@events) do |event|
  json.extract! event, :id, :title, :summary, :place_name, :lat, :lng, :start_date, :end_date, :tag_id
  json.url event_url(event, format: :json)
end
