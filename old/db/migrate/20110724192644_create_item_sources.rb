class CreateItemSources < ActiveRecord::Migration
#  belongs_to	:terrain_item
  def self.up
    create_table :item_sources do |t|
      t.integer :pattern
      t.string :src
      t.integer :terrain_item_id
      t.timestamps
    end
  end

  def self.down
    drop_table :item_sources
  end
end
