# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110724192644) do

  create_table "global_maps", :force => true do |t|
    t.integer  "x"
    t.integer  "y"
    t.string   "src"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "item_sources", :force => true do |t|
    t.integer  "pattern"
    t.string   "src"
    t.integer  "terrain_item_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "terrain_items", :force => true do |t|
    t.string   "name"
    t.integer  "anchor_x"
    t.integer  "anchor_y"
    t.boolean  "passable"
    t.boolean  "movable"
    t.integer  "terrain_type_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "terrain_types", :force => true do |t|
    t.string   "name"
    t.string   "colour"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "email",                                 :default => "", :null => false
    t.string   "encrypted_password",     :limit => 128, :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                         :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "authentication_token"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["authentication_token"], :name => "index_users_on_authentication_token", :unique => true
  add_index "users", ["confirmation_token"], :name => "index_users_on_confirmation_token", :unique => true
  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end