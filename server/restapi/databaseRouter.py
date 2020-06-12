class DatabaseRouter(object):
	 """
	 Determine how to route database calls for an app's model.
	 All other models will be routed to the next router in
	 the DATABASE_ROUTERS setting if applicable, or otherwise
	 to the default database.
	 """

	 def db_for_read(self,model,**hints):
	 	"""
	 	Send all the read operations on myapp2 models to 'candexresumes' 
	 	"""
	 	if model._meta.app_label=='myapp2':
	 		return 'candexresumes'
	 	return None

	 def db_for_write(self,model,**hints):
	 	"""
	 	Send all the write operations on myapp2 models to 'candexresumes'
	 	"""
	 	if model._meta.app_label=='myapp2':
	 		return 'candexresumes'
	 	return None

	 def allow_relation(self,obj1,obj2,**hints):
	 	"""
	 	Determine if relationship is allowed between two objects.
	 	"""
	 	# Allow any relation between two models that are both in the myapp2
	 	if obj1._meta.app_label =='myapp2' and obj2._meta.app_label=='myapp2':
	 		return True
	 	# No opinion if neither object is in the myapp2.(defer to default or other routers)
	 	elif 'myapp2' not in [obj1._meta.app_label,obj2._meta.app_label]:
	 		return None
	 	# Block relationship of one object is in the myapp2 and other isn't
	 	return False

	 def allow_migrate(self,db,app_label,model_name=None,**hints):
	 	"""
	 	Ensure that the myapp2's model gets created in the right database
	 	"""
	 	if app_label=="myapp2":
	 		# This myapp2 app should be migrated only on the 'candexresumes' database
	 		return db=='candexresumes'
	 	elif db=="candexresumes":
	 		# Ensure that all the other apps dont get migrated on the other 'candexresumes' database
	 		return False
	 	# No opinion for all other scenarios
	 	return None