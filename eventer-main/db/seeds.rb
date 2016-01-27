# coding: utf-8
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

%w[乳児 幼児 小学 中学 高校 子育て 母親 父親 親子 趣味 スポーツ].each do |tag|
  TagCollection.create(name: tag)
end

Tag.create(event_id: 1,tag_collection_id: 1)
Tag.create(event_id: 1,tag_collection_id: 2)
Tag.create(event_id: 2,tag_collection_id: 3)
Tag.create(event_id: 2,tag_collection_id: 5)
Tag.create(event_id: 2,tag_collection_id: 7)
Tag.create(event_id: 1,tag_collection_id: 5)
test_admin = User.new
test_admin.name ='admin'
test_admin.login_id = 'admin'
test_admin.email = 'admin@example.com'
test_admin.password = 'admin1234'
test_admin.skip_confirmation!
test_admin.save
test_admin.add_role :admin

test_user1 = User.new
test_user1.name ='test-user1'
test_user1.login_id = 'test1'
test_user1.email = 'user1@example.com'
test_user1.password = 'test1234'
test_user1.skip_confirmation!
test_user1.save

test_user2 = User.new
test_user2.name ='test-user2'
test_user2.login_id = 'test2'
test_user2.email = 'user2@example.com'
test_user2.password = 'test1234'
test_user2.skip_confirmation!
test_user2.save
