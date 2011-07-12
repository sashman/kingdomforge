class TilesetController < ApplicationController
  require "mysql2"
  def index
    client = Mysql2::Client.new(:host => "94.174.150.18", :username =>"wads", :password => "wads1990", :database=>"mapdb")
    results = client.query("SELECT * FROM terrain_item") 
    @terrain_items = Array.new
    results.each do |result|
      @terrain_items.push(result)
    end
  end

end
