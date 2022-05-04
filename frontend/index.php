<?php

	session_start();

	$arr_files_public = array(
		"/frontend/",
		"/assets/vendors/bootstrap/css/bootstrap.min.css",
		"/assets/css/yep-rtl.min.css",
		"/assets/vendors/font-awesome/css/font-awesome.min.css",
		"/frontend/app/vendors/angular-ui-router-anim-in-out/css/anim-in-out.min.css",
		"/frontend/app/vendors/angular-ui-notification/css/angular-ui-notification.min.css",
		"/assets/css/yep-style.css",
		"/frontend/app/vendors/angular-hotkeys/css/hotkeys.min.css",
		"/assets/css/yep-vendors.css",
		"/assets/css/yep-custom.css",
		"/assets/vendors/jquery/jquery.min.js",
		"/assets/vendors/jquery-ui/js/jquery-ui.min.js",
		"/assets/vendors/bootstrap/js/bootstrap.min.js",
		"/assets/vendors/jquery-searchable/js/jquery.searchable.min.js",
		"/assets/vendors/jquery-fullscreen/js/jquery.fullscreen.min.js",
		"/assets/vendors/angularjs/js/angular.min.js",
		"/assets/vendors/angularjs/js/angular-animate.min.js",
		"/assets/vendors/angularjs/js/angular-sanitize.min.js",
		"/assets/vendors/angularjs/js/angular-route.min.js",
		"/assets/vendors/angularjs/js/angular-resource.js",
		"/assets/vendors/angularjs/js/angular-cookies.min.js",
		"/assets/vendors/underscore/js/underscore.min.js",
		"/frontend/app/vendors/restangular/restangular.min.js",
		"/frontend/app/vendors/ui-router/angular-ui-router.min.js",
		"/frontend/app/vendors/angular-ui-router-anim-in-out/js/anim-in-out.min.js",
		"/assets/vendors/oclazyload/js/ocLazyLoad.min.js",
		"/frontend/app/vendors/angular-jwt/angular-jwt.min.js",
		"/frontend/app/vendors/ng-storage/ngStorage.min.js",
		"/frontend/app/vendors/ng-aa/ng-aa.js",
		"/frontend/app/vendors/angular-cache/angular-cache.min.js",
		"/frontend/app/vendors/angular-translate/angular-translate.min.js",
		"/frontend/app/vendors/angular-translate-loader-partial/angular-translate-loader-partial.min.js",
		"/frontend/app/vendors/angular-translate-storage-local/angular-translate-storage-cookie.min.js",
		"/frontend/app/vendors/angular-dynamic-locale/tmhDynamicLocale.min.js",
		"/frontend/app/vendors/angular-ui-notification/js/angular-ui-notification.min.js",
		"/frontend/app/app.js",
		"/frontend/app/vendors/ng-sweet-alert/SweetAlert.min.js",
		"/frontend/app/config.constant.js",
		"/frontend/app/config.router.js",
		"/frontend/app/vendors/angular-ui-jq/ui-jq.min.js",
		"/frontend/app/vendors/angular-ui-load/ui-load.min.js",
		"/frontend/app/vendors/angular-breadcrumb/angular-breadcrumb.min.js",
		"/frontend/app/vendors/angular-hotkeys/js/hotkeys.min.js",
		"/frontend/app/shared/controllers/Preloader.js",
		"/frontend/app/shared/services/TranslationsFactory.js",
		"/frontend/app/vendors/db-sync/sync.js",
		"/frontend/app/vendors/signature_pad/signature_pad.js",
		"/frontend/app/vendors/signature_pad/app.js",
		"/assets/fonts/Lato-Regular.woff2",
		"/frontend/app/shared/lang/locale_en-us.json",
		"/frontend/app/shared/lang/locale_de-de.json",
		"/frontend/app/shared/views/login.html",
		"/assets/vendors/angularjs/js/i18n/angular-locale_de-de.js",
		"/assets/vendors/font-awesome/fonts/fontawesome-webfont.woff2?v=4.3.0",
		"/assets/img/rg_logo.gif",
		"/assets/img/preloader/material.gif",
		"/assets/img/bg/bg_p1.jpg",
		"sam.appcache");
//print_r("URI".in_array($_SERVER['REQUEST_URI'].", Session=".$_SESSION['auth']);
	if(in_array($_SERVER['REQUEST_URI'], $arr_files_public) OR $_SESSION['auth'] == 1){

		$file = str_replace("/frontend/", "", $_SERVER['REQUEST_URI']);
		if($file == "") $file = "index.html";
		$file = '../angular-frontend/' . $file;
//print_r("file_exists=".file_exists($file));
		if(file_exists($file)){

			$file_info = finfo_open(FILEINFO_MIME_TYPE);
			$content_type = finfo_file($file_info, $file);

			if($content_type == "text/plain") {
				if (strpos($file, '.css') !== false) {
					$content_type = "text/css";
				}
			}

			if($file == "sam.appcache") {
				$content_type = "text/cache.manifest";
			}

			header('Content-Type: ' . $content_type);

			if(	$file == "../angular-frontend/app/shared/views/login.html" OR
				$file == "../angular-frontend/index.html"  OR
				$file == "../angular-frontend/app/shared/views/admin.html"){
				$ips_without_2fa    = array(
					"193.158.97.78",    //Rheingas
					"193.158.97.85"     //Rheingas
				);

				ob_start();
				require_once($file);
				$file_content = ob_get_contents();
				ob_end_clean();
				echo $file_content;
			}else {
				readfile($file);
			}

			finfo_close($file_info);
		}else{
			http_response_code(403);
			echo "Zugriff nicht erlaubt".$file;
		}

	}else{
		http_response_code(403);
		echo "Zugriff nicht erlaubt".in_array($_SERVER['REQUEST_URI'], $arr_files_public) ." Session=". $_SESSION['auth'];
	}

?>
