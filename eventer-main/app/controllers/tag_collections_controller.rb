class TagCollectionsController < ApplicationController
  before_action :set_tag_collection, only: [:show, :edit, :update, :destroy]

  respond_to :html
  def get_all_tag
    @tag_collections = TagCollection.all
    render :json => @tag_collections
  end
  def index
    @tag_collections = TagCollection.all
    respond_to do |format|
      format.html
      format.json{render :json =>@tag_collections}
    end
  end

  def show
    respond_with(@tag_collection)
  end

  def new
    @tag_collection = TagCollection.new
    respond_with(@tag_collection)
  end

  def edit
  end

  def create
    @tag_collection = TagCollection.new(tag_collection_params)
    @tag_collection.save
    respond_with(@tag_collection)
  end

  def update
    @tag_collection.update(tag_collection_params)
    respond_with(@tag_collection)
  end

  def destroy
    @tag_collection.destroy
    respond_with(@tag_collection)
  end

  private
    def set_tag_collection
      @tag_collection = TagCollection.find(params[:id])
    end

    def tag_collection_params
      params.require(:tag_collection).permit(:name)
    end
end
