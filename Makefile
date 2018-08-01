# タスクを指定しないmakeの実行を禁止する.
all:
	echo "make単体での実行は禁止されています.タスクを指定して実行して下さい."
	exit 1

# projectのセットアップ
setup:
	@read -p "site.ymlの設定は完了していますか？ [y,N]:" ans; \
	if [ "$$ans" = y ]; then \
	  yarn install; \
	  vagrant up; \
	fi


##################################
# frontend
##################################

# gulp起動.
gulp:
	gulp

# cssのコンパイル.
build_styles:
	gulp styles

# jsのコンパイル.
build_scripts:
	gulp scripts

# js dllのコンパイル.
build_scripts-dll:
	gulp scripts.dll


##################################
# Server
##################################

# WPサーバーを立ち上げ、サーバーのURLを開く.
run:
	vagrant up
	open http://192.168.33.10

# WPサーバーをシャットダウンする.
down:
	vagrant halt

# WPサーバーにログインする.
login:
	vagrant ssh


##################################
# DB
##################################

# WPのDBをインポートする.
db_import:
	vagrant ssh -c "wp --path=/var/www/html db import /vagrant/import.sql"

# WPのDBをエクスポートする.
db_export:
	vagrant ssh -c "wp --path=/var/www/html db export /vagrant/import.sql"


##################################
# Push staging
##################################

# stgにthemeをpushする.
push_stg_theme:
	vagrant exec wordmove push -t -e staging

# stgにthemeとcoreをpushする.
push_stg_theme_and_core:
	vagrant exec wordmove push -t -w -e staging

# stgにdbをpushする.
push_stg_db:
	vagrant exec wordmove push -d -e staging

# stgに全てpushする.
push_stg_all:
	(cd ./frontend; gulp gzip);
	vagrant exec wordmove push --all -e staging


##################################
# Pull production
##################################

# stgからthemeをpullする.
pull_stg_theme:
	@read -p "stagingからthemeをpullしますか? [y,N]:" ans; \
	if [ "$$ans" = y ]; then vagrant exec wordmove pull -t -e staging; fi

# stgからdbをpullする.
pull_stg_db:
	@read -p "stagingからdbをpullしますか? [y,N]:" ans; \
  if [ "$$ans" = y ]; then vagrant exec wordmove pull -d -e staging; fi

# stgから全てpullする.
pull_stg_all:
	@read -p "stagingから全データをpullしますか? [y,N]:" ans; \
  if [ "$$ans" = y ]; then vagrant exec wordmove pull --all -e staging; fi


##################################
# Push production
##################################

# proにthemeをpushする.
push_pro_theme:
	@read -p "productionにthemeをpushしますか? [y,N]:" ans; \
  if [ "$$ans" = y ]; then vagrant exec wordmove push -t -e production; fi

# proにthemeとcoreをpushする.
push_pro_theme_and_core:
	@read -p "productionにthemeとcoreをpushしますか? [y,N]:" ans; \
  if [ "$$ans" = y ]; (cd ./frontend; gulp gzip); then vagrant exec wordmove push -t -w -e production; fi

# proにdbをpushする.
push_pro_db:
	@read -p "productionにdbをpushしますか? [y,N]:" ans; \
  if [ "$$ans" = y ]; then vagrant exec wordmove push -d -e production; fi

# proに全てpushする.
push_pro_all:
	@read -p "productionに全データをpushしますか? [y,N]:" ans; \
  if [ "$$ans" = y ]; (cd ./frontend; gulp gzip); then vagrant exec wordmove push --all -e production; fi


##################################
# Pull production
##################################

# proからthemeをpullする.
pull_pro_theme:
	@read -p "productionからthemeをpullしますか? [y,N]:" ans; \
  if [ "$$ans" = y ]; then vagrant exec wordmove pull -t -e production; fi

# proからuploadsをpullする.
pull_pro_uploads:
	@read -p "productionからuploadsをpullしますか? [y,N]:" ans; \
  if [ "$$ans" = y ]; then vagrant exec wordmove pull -u -e production; fi

# proからdbをpullする.
pull_pro_db:
	@read -p "productionからdbをpullしますか? [y,N]:" ans; \
  if [ "$$ans" = y ]; then vagrant exec wordmove pull -d -e production; fi

# proからdbとuploadsをpullする.
pull_pro_db_and_uploads:
	@read -p "productionからdbとuploadsをpullしますか? [y,N]:" ans; \
  if [ "$$ans" = y ]; then vagrant exec wordmove pull -d -u -e production; fi

# proから全てpullする.
pull_pro_all:
	@read -p "productionから全データをpullしますか? [y,N]:" ans; \
  if [ "$$ans" = y ]; then vagrant exec wordmove pull --all -e production; fi


##################################
# Util
##################################

# DBのバックアップファイルを全て削除する.
clean_db_backup:
	rm ./wordpress/wp-content/*.sql.gz
