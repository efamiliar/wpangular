# WP Angular

This project aims to integrate Angular with WordPress via its REST API, and serve as a solid base for anyone who wants to create a theme for WP using the amazing Angular framework and focus on the creative part, rather than re-implementing all the basic logic.

# Live DEMO

You can see what this looks like in a real WordPress installation here: https://wpangular.com

# Simplicity

I am keeping the creative aspects of this project simple so that it will be easy to use as a clean base. That means: no extra assets or libraries like jQuery, Fontawesome, Bootstrap, etc will be added to this sample theme.

All I am using is CSS Grids and clear HTML structures so that you can get the idea of how the basic WP blocks are being displayed.

# Documented code

I try to make the code as clean and commented as possible. If you are starting with Angular, don't be afraid and give the source a look. I'm sure you will get it to work and build something amazing with it.

# Feedback

I am currently developing this project, which means it will receive frequent updates. Feel free to provide feedback and constructive criticism in the *Issues* section.

# How to Build

Run `ng build --prod --deploy-url="/wp-content/themes/wpangular/dist/app/" --aot=false --buildOptimizer=false` to build the project. Upload the /dist folder,along with index.php, functions.php and style.css to your theme folder.

Note that in the example I chose "wpangular" as the wordpress theme folder, you can of course choose whatever you like.

# Required WordPress plugins

I am not a fan of using a WP plugin for every desired feature, and also I don't want to make this a plugin dependent project.

The only plugin you will need to install is *JWT Authentication*, if you want to use the features that require user login.