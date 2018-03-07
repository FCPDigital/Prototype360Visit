<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', '360_wp');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '3)L}jDjdg*jNt%(,:ZM)7w@5l,hA^3GrR5f{7`?oGwp&p^qd|rlSjeNekp<iL=nf');
define('SECURE_AUTH_KEY',  ']|ES=T?7#OIG/B/:Q)uc0y~f.G=UO_+=/O>G@M~:MIL:1&`[J;*$B#D+[G|tC0*0');
define('LOGGED_IN_KEY',    '#}V#g0ljEQK%nQ0Blb,UA*922-R>%b%72_R](~VZ$55?4[ZN5@Lm|v/QAi%+9kD+');
define('NONCE_KEY',        '&qa~{<+x6(>FJ$1*Hs!)w>W-K&g-C&$q4kw_S?|K}iIL 9K3q`EHVF{QdKlq<_Cz');
define('AUTH_SALT',        'sRNIGZ304Ydqin,CQ#[Z.7FPut*j<E}p^WXj-vAn;TieFi@^}J&Gt7Hi3ayx|EB.');
define('SECURE_AUTH_SALT', 'pB=9HpPwuTR+z0/z>O$@|rcx3WC6-sr8)CIl/yq^~X%ctF5%}#?M5xFaH3|V#1RB');
define('LOGGED_IN_SALT',   '`K;eav+i#m~R};TFt5[ plh6Dp$l_WD@dD9nAFYY$VQ_bkQN!8OsPgMJMK31++BU');
define('NONCE_SALT',       'Us:eC$AD#<-rXo/$fg L6r-{*h8c[ vi7Pd<q#F0Ud3}5jhLfv%]HmNn8d|T(?pH');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', true);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
