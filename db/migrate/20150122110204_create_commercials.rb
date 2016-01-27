class CreateCommercials < ActiveRecord::Migration
  def change
    create_table :commercials do |t|
      t.string :name
      t.string :url
      t.integer :image_id

      t.timestamps
    end
  end
end
