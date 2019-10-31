<?php

// Enable Featured Images
function wpangular_post_thumbnails() {
    add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'wpangular_post_thumbnails' );

// Add Main Menu
add_action( 'after_setup_theme', 'register_custom_nav_menus' );
function register_custom_nav_menus() {
	register_nav_menus( array(
		'main_menu' => 'Main menu',
		'footer_menu' => 'Footer Menu',
	) );
}



/* REST Endpoints Callbacks */

// Get menu by id
function wpangular_get_menu_items_by_menu_id( $id ) {
	$menu_items = wp_get_nav_menu_items( $id );
	// wordpress does not group child menu items with parent menu items
	$child_items = [];
	// pull all child menu items into separate object
	foreach ( $menu_items as $key => $item ) {
		if ( $item->menu_item_parent ) {
			array_push( $child_items, $item );
			unset( $menu_items[ $key ] );
		}
	}
	// push child items into their parent item in the original object
	do {
		foreach($child_items as $key => $child_item) {
			if(wpangular_check_if_is_child($menu_items, $child_item)) {
				unset($child_items[$key]);
			}
		}
	} while(count($child_items));
	return array_values($menu_items);
}

// Check if a menu item is child of another given set
function wpangular_check_if_is_child( &$parents, $child ) {
	foreach ( $parents as $key => $item ) {
		if ( $child->menu_item_parent == $item->ID ) {
			if ( ! $item->child_items ) {
				$item->child_items = [];
			}
			array_push( $item->child_items, $child );
			return true;
		}
		if($item->child_items) {
			if(wpangular_check_if_is_child($item->child_items, $child)) {
				return true;
			}
		}
	}
	return false;
}

// Get menu at specific location (by location id or slug)
function wpangular_get_menu_at_location( $data ){
	// Create default empty object
	$menu = new stdClass;
	// this could be replaced with `if (has_nav_menu($data['id']))`
	if ( ( $locations = get_nav_menu_locations() ) && isset( $locations[ $data['id'] ] ) ) {
		// Replace default empty object with the location object
		$menu        = get_term( $locations[ $data['id'] ] );
		$menu->items = wpangular_get_menu_items_by_menu_id( $locations[ $data['id'] ] );
	} else {
		return new WP_Error( 'not_found', 'No location has been found with this id or slug: `' . $data['id'] . '`. Please ensure you passed an existing location ID or location slug.', array( 'status' => 404 ) );
	}
	return $menu;
}


// Get Permalink Structure
function wpangular_get_permalink_structure(){
	$permalink_structure = [];
	$permalink_structure['posts_permalink'] = get_option( 'permalink_structure' );
	$permalink_structure['tag_base'] = get_option( 'tag_base' );
	if(strlen($permalink_structure['tag_base'])==0){ $permalink_structure['tag_base']='tag'; }
	$permalink_structure['category_base'] = get_option( 'category_base' );
	if(strlen($permalink_structure['category_base'])==0){ $permalink_structure['category_base']='category'; }
	$response = new WP_REST_Response($permalink_structure);
    $response->set_status(200);

    return $response;
}


// Extra field on posts to get featured image
// Note: The featured media id is already included but we don't want to do another extra request to get the url by id
function wpangular_get_featured_image( $object, $field_name, $request ) {
    if( $object['featured_media'] ){
        $img = wp_get_attachment_image_src( $object['featured_media'], 'app-thumb' );
        return $img[0];
    }
    return false;
}



add_action( 'rest_api_init', function () {

	// Added routes

	register_rest_route( 'wpangular/v1', '/permalinks', array(
		'methods'  => 'GET',
		'callback' => 'wpangular_get_permalink_structure',
	) );

	register_rest_route( 'wpangular/v1', '/menus/location/(?P<id>[a-zA-Z0-9_-]+)', array(
		'methods'  => 'GET',
		'callback' => 'wpangular_get_menu_at_location',
	) );

	// Added fields

	register_rest_field( array('post'),
        'featured_img_url',
        array(
            'get_callback'    => 'wpangular_get_featured_image',
            'update_callback' => null,
            'schema'          => null,
        )
    );

} );
?>