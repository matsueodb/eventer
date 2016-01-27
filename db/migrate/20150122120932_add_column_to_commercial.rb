class AddColumnToCommercial < ActiveRecord::Migration
  def change
    add_column :commercials, :lng, :float
    add_column :commercials, :lat, :float
  end
end
