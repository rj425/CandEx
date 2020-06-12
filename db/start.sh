# Starting SQL service
service mysql start


mysqlUser="root"
mysqlPass="root"
# Use host="127.0.0.1" for running locally
host="172.17.0.1"

# Read MySQL password from stdin if empty
if [ -z "${mysqlPass}" ]; then
  echo -n "Enter MySQL ${mysqlUser} password: "
  read -s mysqlPass
  echo
fi
# Check MySQL password
echo exit | mysql --user=${mysqlUser} --password=${mysqlPass} -B 2>/dev/null
if [ "$?" -gt 0 ]; then
  echo "MySQL ${mysqlUser} password incorrect"
  exit 1
else
  echo "MySQL ${mysqlUser} password correct."
fi
# DATABASE NAME - candex
echo 'CREATE DATABASE candex' | mysql --user=${mysqlUser} --password=${mysqlPass}
echo 'ALTER DATABASE candex CHARACTER SET UTF8MB4' | mysql --user=${mysqlUser} --password=${mysqlPass}
echo 'GRANT ALL PRIVILEGES ON candex.* TO "root"@'${host}' IDENTIFIED BY "root"' | mysql --user=${mysqlUser} --password=${mysqlPass}
echo 'FLUSH PRIVILEGES' | mysql --user=${mysqlUser} --password=${mysqlPass}
# DATABASE NAME - candexresumes
echo 'CREATE DATABASE candexresumes' | mysql --user=${mysqlUser} --password=${mysqlPassword}
echo 'ALTER DATABASE candexresumes CHARACTER SET UTF8MB4' | mysql --user=${mysqlUser} --password=${mysqlPass}
echo 'GRANT ALL PRIVILEGES ON candexresumes.* TO "root"@'${host}' IDENTIFIED BY "root"' | mysql --user=${mysqlUser} --password=${mysqlPass}
echo 'FLUSH PRIVILEGES' | mysql --user=${mysqlUser} --password=${mysqlPass} 

service mysql restart
/bin/bash
