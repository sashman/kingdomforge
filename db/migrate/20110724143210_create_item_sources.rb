class CreateItemSources < ActiveRecord::Migration
  def self.up
    create_table :item_sources do |t|
      t.integer :pattern
      t.text :src

      t.timestamps
    end
  end

  def self.down
    drop_table :item_sources
  end
end
