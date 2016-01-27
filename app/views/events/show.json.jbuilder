json.extract! @event, :id, :title, :url, :summary, :place_name, :lat, :lng, :start_date, :end_date, :address

comments = @event.comments
json.comment(comments) do |c|
  json.comment c, :value
end

tags = Tag.where(event_id: @event.id).pluck(:tag_collection_id)
tag_names = TagCollection.where(id: tags)
json.tags(tag_names) do |t|
  json.tag t, :name
end
