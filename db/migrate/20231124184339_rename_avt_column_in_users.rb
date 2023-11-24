class RenameAvtColumnInUsers < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :avt, :avatar
  end
end
