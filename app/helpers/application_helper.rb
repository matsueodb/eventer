module ApplicationHelper
  def url_for(options = {})
    prefix = Rails.application.config.relative_url_root
    path = super
    if path =~ /^#{prefix}/
      path
    else
      prefix + path
    end
  end
end
