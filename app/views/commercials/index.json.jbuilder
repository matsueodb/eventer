json.array!(@commercials) do |commercial|
  json.extract! commercial, :id, :name, :url, :image_id
  json.url commercial_url(commercial, format: :json)
end
