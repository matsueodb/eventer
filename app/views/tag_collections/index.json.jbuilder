json.array!(@tag_collections) do |tag_collection|
  json.extract! tag_collection, :id, :name
  json.url tag_collection_url(tag_collection, format: :json)
end
