class AddColumnUsers < ActiveRecord::Migration
  def change
    add_column :users, :name, :string
    add_column :users, :login_id, :string
  end
end
