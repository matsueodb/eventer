class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #protect_from_forgery with: :exception
  protect_from_forgery with: :null_session
  layout 'application'

  def url_for(string)
    prefix = Rails.application.config.relative_url_root
    path = super
    case path
    when /^#{prefix}/
      path
    when /^http:\/\/(.*)$/
      ary = $1.split(/\//)
      ary[0] += prefix
      "http://" + ary.join("/")
    else
      prefix + path
    end
  end

  def root_path
    Rails.application.config.relative_url_root || '/'
  end

  # for devise
  def after_sign_in_path_for(resource)
    root_path
  end
  def after_sign_out_path_for(resource)
    root_path
  end
end
