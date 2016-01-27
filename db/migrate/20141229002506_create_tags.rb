class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.integer :event_id
      t.integer :tag_collection_id

      t.timestamps
    end
  end
end
