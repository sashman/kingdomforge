class TerrainTypesController < ApplicationController
  # GET /terrain_types
  # GET /terrain_types.xml
  def index
    @terrain_types = TerrainType.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @terrain_types }
    end
  end

  # GET /terrain_types/1
  # GET /terrain_types/1.xml
  def show
    @terrain_type = TerrainType.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @terrain_type }
    end
  end

  # GET /terrain_types/new
  # GET /terrain_types/new.xml
  def new
    @terrain_type = TerrainType.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @terrain_type }
    end
  end

  # GET /terrain_types/1/edit
  def edit
    @terrain_type = TerrainType.find(params[:id])
  end

  # POST /terrain_types
  # POST /terrain_types.xml
  def create
    @terrain_type = TerrainType.new(params[:terrain_type])

    respond_to do |format|
      if @terrain_type.save
        format.html { redirect_to(@terrain_type, :notice => 'Terrain type was successfully created.') }
        format.xml  { render :xml => @terrain_type, :status => :created, :location => @terrain_type }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @terrain_type.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /terrain_types/1
  # PUT /terrain_types/1.xml
  def update
    @terrain_type = TerrainType.find(params[:id])

    respond_to do |format|
      if @terrain_type.update_attributes(params[:terrain_type])
        format.html { redirect_to(@terrain_type, :notice => 'Terrain type was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @terrain_type.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /terrain_types/1
  # DELETE /terrain_types/1.xml
  def destroy
    @terrain_type = TerrainType.find(params[:id])
    @terrain_type.destroy

    respond_to do |format|
      format.html { redirect_to(terrain_types_url) }
      format.xml  { head :ok }
    end
  end
end
