class CommercialsController < ApplicationController
  before_action :set_commercial, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @commercials = Commercial.all
    respond_with(@commercials)
  end

  def show
    #respond_with(@commercial)
    render :jbuilder => @commercial
  end

  def new
    @commercial = Commercial.new
    respond_with(@commercial)
  end

  def edit
  end

  def create
    @commercial = Commercial.new(commercial_params)
    @commercial.save
    respond_with(@commercial)
  end

  def update
    @commercial.update(commercial_params)
    respond_with(@commercial)
  end

  def destroy
    @commercial.destroy
    respond_with(@commercial)
  end

  private
    def set_commercial
      @commercial = Commercial.find(params[:id])
    end

    def commercial_params
      params.require(:commercial).permit(:name, :url, :lng, :lat, :image_id)
    end
end
