class Comment < ActiveRecord::Base
  resourcify
  belongs_to :user
  include Authority::Abilities
end
