class CreateGlobalMaps < ActiveRecord::Migration
  def self.up
    create_table :global_maps do |t|
      t.integer :x
      t.integer :y
      t.string :src

      t.timestamps
    end
  end

  def self.down
    drop_table :global_maps
  end
end
