# coding: utf-8
class Event < ActiveRecord::Base
  has_many :tags
  has_many :comments
  def Event.find_by_area(lat,lng,rad,start_date,end_date)
    exception = false
    start_date ||= DateTime.now.prev_year.to_s
    end_date ||= DateTime.now.to_s
    #nil or empty string is 0
    lat = lat.to_f
    lng = lng.to_f
    rad = rad.to_f
    begin
    x1 = "(lng * PI() / 180.0)"
    y1 = "(lat * PI() / 180.0)"
    x2 = "(#{lng} * #{Math::PI} / 180.0)"
    y2 = "(#{lat} * #{Math::PI} / 180.0)"
    deg = "(SIN(#{y1})*SIN(#{y2}) + COS(#{y1})*COS(#{y2})*COS(#{x1} - #{x2}))"
    distance = "(6378140 * (ATAN(-#{deg}/SQRT(-#{deg}*#{deg}+1))+PI()/2)/1000)"
    p start_date,end_date
    start_date = DateTime.parse(start_date).to_date.to_datetime
    end_date = DateTime.parse(end_date).to_date.to_datetime


    #same date
    if start_date == end_date
      end_date += 23.hour + 59.minute + 59.second
    end
    start_date = "timestamp '" + start_date.strftime("%Y-%m-%d %H:%M:%S") + "'"
    end_date = "timestamp '" + end_date.strftime("%Y-%m-%d %H:%M:%S") + "'"

    p find_by_sql([<<-SQL
select * from events where (#{distance} <= #{rad.to_f})
and(
     (#{start_date} <= start_date
      and start_date <= #{end_date})
   or (#{start_date} <= end_date
      and end_date <= #{end_date})
   or (start_date <= #{start_date}
      and #{start_date} <= end_date)
   or (start_date <= #{end_date}
      and #{end_date} <= end_date)

)
SQL
                  ])
    rescue ArgumentError => e
      start_date = DateTime.now.prev_year.to_s
      end_date = DateTime.now.to_s
      retry
    rescue => e
      p 'zero div?'
      lat += 0.000001
      lng += 0.000001
      p e.class
      p e.backtrace
      unless exception
        exception = true
        retry
      end
    end
  end
end
