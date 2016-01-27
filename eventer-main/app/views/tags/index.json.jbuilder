json.array!(@tags) do |tag|
  json.extract! tag, :id, :event_id, :tag_collection_id
  json.url tag_url(tag, format: :json)
end
