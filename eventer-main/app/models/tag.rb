class Tag < ActiveRecord::Base
  #has_one :event
  belongs_to :event
  belongs_to :tag_collection
end
