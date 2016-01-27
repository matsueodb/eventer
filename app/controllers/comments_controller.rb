class CommentsController < ApplicationController
  before_action :set_comment, only: [:show, :edit, :update, :destroy]
  respond_to :html
  def get_name

    seii = {'name' => 't', 'name2'=>'r'}
    ito = {'name' => 'k', 'name2'=>'s'}
    
    names = [seii, ito]
    render :json => names
  end

  def index
    @comments = Comment.all
    p current_user
    respond_with(@comments)
  end

  def show
    respond_with(@comment)
  end

  def new
    @comment = Comment.new
    respond_with(@comment)
  end

  def edit
  end

  def create
    @comment = Comment.new
    p params
    p 'params'
    p params['value']
    @comment.value = params['value']
    @comment.event_id = params['event_id'].to_i
    @comment.user_id = current_user.id if user_signed_in?
    @comment.save
    status = {status: 'success'}
    render :json => status
  end

  def update
    @comment.update(comment_params)
    respond_with(@comment)
  end

  def destroy
    @comment.destroy
    respond_with(@comment)
  end

  private
    def set_comment
      @comment = Comment.find(params[:id])
    end

    def comment_params
      params.require(:comment).permit(:value, :event_id)
    end
end
