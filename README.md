# WP Angular

This project aims to integrate Angular with WordPress via REST API, and serve as a base for anyone who wants to create a theme for WP using the amazing Angular framework.

## Build

Run `ng build --prod --deploy-url="/wp-content/themes/wpangular/dist/app/" --aot=false --buildOptimizer=false` to build the project. Upload the /dist folder,along with index.php, functions.php and style.css to your theme folder.

Note that in the example I put "wpangular" as the wordpress theme folder, you can of course choose whatever you like.

## Login user

I am working on the login functionality, for which the JWT Authentication plugin is required, since the WordPress REST API does not yet provide a secure way for user authorization.

## License

Both Angular and WordPress are free for everybody. I am sharing this because sharing makes the world a better place. Do whatever you like with this bunch of lines. Also feel free to contribute.