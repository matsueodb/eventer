class Image < ActiveRecord::Base
   mount_uploader :data, ImageUploader
end
