require 'test_helper'

class TerrainTypesControllerTest < ActionController::TestCase
  setup do
    @terrain_type = terrain_types(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:terrain_types)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create terrain_type" do
    assert_difference('TerrainType.count') do
      post :create, :terrain_type => @terrain_type.attributes
    end

    assert_redirected_to terrain_type_path(assigns(:terrain_type))
  end

  test "should show terrain_type" do
    get :show, :id => @terrain_type.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @terrain_type.to_param
    assert_response :success
  end

  test "should update terrain_type" do
    put :update, :id => @terrain_type.to_param, :terrain_type => @terrain_type.attributes
    assert_redirected_to terrain_type_path(assigns(:terrain_type))
  end

  test "should destroy terrain_type" do
    assert_difference('TerrainType.count', -1) do
      delete :destroy, :id => @terrain_type.to_param
    end

    assert_redirected_to terrain_types_path
  end
end
