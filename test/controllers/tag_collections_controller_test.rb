require 'test_helper'

class TagCollectionsControllerTest < ActionController::TestCase
  setup do
    @tag_collection = tag_collections(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:tag_collections)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create tag_collection" do
    assert_difference('TagCollection.count') do
      post :create, tag_collection: { name: @tag_collection.name }
    end

    assert_redirected_to tag_collection_path(assigns(:tag_collection))
  end

  test "should show tag_collection" do
    get :show, id: @tag_collection
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @tag_collection
    assert_response :success
  end

  test "should update tag_collection" do
    patch :update, id: @tag_collection, tag_collection: { name: @tag_collection.name }
    assert_redirected_to tag_collection_path(assigns(:tag_collection))
  end

  test "should destroy tag_collection" do
    assert_difference('TagCollection.count', -1) do
      delete :destroy, id: @tag_collection
    end

    assert_redirected_to tag_collections_path
  end
end
