class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :title
      t.text :summary
      t.string :place_name
      t.float :lat
      t.float :lng
      t.datetime :start_date
      t.datetime :end_date
      t.integer :tag_id

      t.timestamps
    end
  end
end
