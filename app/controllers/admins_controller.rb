class AdminsController < ApplicationController
  before_action :authenticate_user!
  before_action :authenticate_admin
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  respond_to :html
  def index
    @users = User.all
    respond_with(@users)
  end

  def destroy
    @user.destroy
    @users = User.all
    render :action => 'index'
  end

  def new
  end

  def show
    respond_with(@user)
  end

  def create
    name     = params[:name]
    password = params[:password]
    email    = params[:email]
    login_id = params[:login_id]
    auth     = params[:auth]

    user = User.create! do |u|
      u.password = password
      u.email = email
    end
    user.skip_confirmation!
    user.save
    user.name = name
    user.login_id = login_id
    user.save
    auth.each do |k,v|
      user.add_role k.downcase if v == '1'
    end
    @users = User.all
    render :action => 'index'
  end

  def update
    auth = params[:auth]
    auth.each do |k,v|
      if v == '1'
        @user.add_role k.downcase
      else
        @user.remove_role k.downcase
      end
    end
    @users = User.all
    render :action => 'index'
  end

  def edit
    respond_with(@user)
  end
  private
  def set_user
    @user = User.find(params[:id])
  end

  def authenticate_admin
    p  current_user.roles
    if current_user.has_role? :admin
      p 'admin'
    else
      redirect_to root_path
    end
  end
end
