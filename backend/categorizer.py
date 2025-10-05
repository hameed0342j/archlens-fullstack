"""
Intelligent package categorizer based on name patterns and heuristics.
"""

CATEGORY_PATTERNS = {
    'System Core': [
        'linux', 'kernel', 'grub', 'systemd', 'base', 'filesystem', 'coreutils',
        'util-linux', 'mkinitcpio', 'efibootmgr', 'device-mapper', 'cryptsetup',
        'dosfstools', 'e2fsprogs', 'ntfs-3g', 'exfatprogs', 'bash', 'zsh', 'fish',
        'kbd', 'kmod', 'procps', 'shadow', 'sudo', 'tzdata', 'licenses'
    ],
    'System Services & Daemons': [
        'dbus', 'avahi', 'cronie', 'polkit', 'rtkit', 'upower', 'udisks',
        'colord', 'accounts', 'bluetooth', 'samba', 'rpcbind', 'smartmontools',
        'lm_sensors', 'bolt', 'sane', 'cups'
    ],
    'Display & Graphics': [
        'xorg', 'mesa', 'vulkan', 'nvidia', 'intel-media', 'libva', 'libdrm',
        'libglvnd', 'egl', 'wayland', 'xdg-desktop-portal', 'seatd', 'ddcutil',
        'hypr', 'wlr', 'wlogout', 'wofi', 'rofi', 'waybar', 'swaync', 'nwg'
    ],
    'Audio Subsystem': [
        'pipewire', 'wireplumber', 'alsa', 'pulseaudio', 'pavucontrol', 'rtkit',
        'sof-firmware', 'libsamplerate', 'libsndfile', 'libcanberra', 'jack'
    ],
    'Networking': [
        'networkmanager', 'iproute2', 'iptables', 'iputils', 'iwd', 'wpa_supplicant',
        'dhcpcd', 'openssh', 'openvpn', 'wireguard', 'modemmanager', 'curl', 'wget',
        'rsync', 'transmission', 'qbittorrent', 'socat', 'cifs-utils', 'nfs-utils',
        'bluez', 'blueman', 'bluedevil', 'wireless'
    ],
    'Security & Encryption': [
        'gnupg', 'gpgme', 'pinentry', 'pass', 'openssl', 'gnutls', 'ca-certificates',
        'p11-kit', 'nss', 'krb5', 'pam', 'libcap', 'libseccomp', 'audit', 'gcr',
        'libsecret', 'libgcrypt', 'argon2', 'libsodium', 'rhash', 'tpm2'
    ],
    'Command-line Utilities': [
        'tree', 'htop', 'bat', 'fd', 'ripgrep', 'fzf', 'exa', 'eza', 'starship',
        'tmux', 'screen', 'alacritty', 'kitty', 'foot', 'ghostty', 'neofetch',
        'fastfetch', 'ranger', 'vifm', 'mc', 'jq', 'pv', 'rsync', 'figlet',
        'cava', 'ncdu', 'vim', 'neovim', 'nano', 'less', 'grep', 'sed', 'awk',
        'findutils', 'diffutils', 'patch'
    ],
    'Arch Linux & AUR Helpers': [
        'pacman', 'yay', 'paru', 'aurutils', 'reflector', 'arch-install-scripts',
        'archlinux-keyring', 'pacseek', 'checkupdates'
    ],
    'Desktop Environment (General)': [
        'xdg-utils', 'xdg-user-dirs', 'desktop-file-utils', 'shared-mime-info',
        'hicolor-icon-theme', 'dconf', 'gsettings', 'gvfs', 'tumbler', 'gnome-keyring',
        'dunst', 'mako', 'nitrogen', 'feh', 'peek', 'obs-studio', 'ffmpeg', 'imagemagick'
    ],
    'KDE Plasma Components': [
        'plasma', 'kwin', 'kscreen', 'kinfocenter', 'systemsettings', 'powerdevil',
        'sddm', 'breeze', 'oxygen', 'kde', 'akonadi', 'kate', 'dolphin', 'konsole',
        'yakuake', 'okular', 'spectacle', 'gwenview', 'ark', 'filelight', 'kcalc',
        'kmail', 'kontact', 'korganizer', 'kaddressbook', 'kdenlive', 'ktorrent',
        'krdc', 'krfb', 'elisa', 'kamoso', 'kwave', 'k3b', 'kcolorchooser', 'kruler',
        'kmag', 'kmouth', 'kontrast', 'kgamma', 'kompare', 'lokalize', 'umbrello',
        'kcachegrind', 'massif', 'kapptemplate', 'kirigami', 'qqc2', 'attica',
        'frameworkintegration', 'kactivities', 'solid', 'threadweaver', 'baloo',
        'kidentity', 'kldap', 'kmail', 'kmime', 'kpim', 'ksmtp', 'ktnef', 'kdav',
        'kpk', 'kitinerary', 'kopen', 'kosm', 'kpublic', 'kweather', 'khealth',
        'prison', 'kdiagram', 'kqt', 'ktext', 'kgapi', 'libkleo', 'libkdepim',
        'libksieve', 'libksysguard', 'libgravatar', 'kedit', 'konqueror', 'falkon',
        'blinken', 'bomber', 'bovo', 'granatier', 'kajongg', 'kapman', 'katomic',
        'kblackbox', 'kblocks', 'kbounce', 'kbreakout', 'kbruch', 'kdiamond',
        'kfourinline', 'kgoldrunner', 'kigo', 'killbots', 'kiriki', 'kjump',
        'klickety', 'klines', 'kmahjongg', 'kmines', 'knaval', 'knetwalk', 'kolf',
        'kollision', 'konquest', 'kpat', 'kreversi', 'kshisen', 'ksirk', 'ksnake',
        'kspace', 'ksquares', 'ksudoku', 'ktuberling', 'kubrick', 'lskat', 'palapeli',
        'picmi', 'kasts', 'kalk', 'kalm', 'kclock', 'keysmith', 'krecorder', 'ktrip',
        'tokodon', 'telly', 'alligator', 'angelfish', 'arianna', 'audiotube',
        'francis', 'koko', 'neochat', 'plasmatube', 'calligra', 'cantor', 'kalgebra',
        'kalzium', 'kanagram', 'kgeography', 'khangman', 'kig', 'kiten', 'klettres',
        'kmplot', 'ktouch', 'kturtle', 'kwordquiz', 'minuet', 'parley', 'rocs',
        'step', 'artikulate', 'kamera', 'wacom', 'kolourpaint', 'svgpart', 'cervisia',
        'kdesdk', 'poxml', 'kimage', 'kgraph', 'kongress', 'itinerary', 'kcron',
        'kjournald', 'kgpg', 'kleopatra', 'kwallet', 'sweeper', 'discover', 'flatpak-kcm',
        'plymouth-kcm'
    ],
    'User Applications (GUI)': [
        'firefox', 'chromium', 'google-chrome', 'brave', 'vivaldi', 'libreoffice',
        'onlyoffice', 'thunderbird', 'evolution', 'discord', 'slack', 'teams',
        'zoom', 'telegram', 'signal', 'gimp', 'krita', 'inkscape', 'blender',
        'darktable', 'digikam', 'vlc', 'mpv', 'audacity', 'ardour', 'musescore',
        'calibre', 'obsidian', 'visual-studio-code', 'vscodium', 'atom', 'sublime',
        'gedit', 'pluma', 'mousepad', 'geany', 'drawio', 'claude-desktop'
    ],
    'Development Tools & IDEs': [
        'gcc', 'clang', 'llvm', 'make', 'cmake', 'meson', 'ninja', 'autoconf',
        'automake', 'libtool', 'pkgconf', 'bison', 'flex', 'patch', 'gdb', 'lldb',
        'valgrind', 'strace', 'perf', 'git', 'mercurial', 'subversion', 'kdevelop',
        'qtcreator', 'eclipse', 'netbeans', 'android-studio', 'intellij', 'pycharm',
        'doxygen', 'ctags', 'cscope'
    ],
    'Programming Languages & Runtimes': [
        'python', 'ruby', 'perl', 'nodejs', 'npm', 'yarn', 'deno', 'php', 'java',
        'jdk', 'jre', 'openjdk', 'maven', 'gradle', 'scala', 'kotlin', 'erlang',
        'elixir', 'haskell', 'ghc', 'ocaml', 'rust', 'cargo', 'go', 'dotnet', 'mono',
        'lua', 'luajit', 'tcl', 'julia', 'r', 'octave', 'racket', 'scheme', 'sbcl',
        'zig', 'nvm', 'python310'
    ],
    'GUI Toolkits': [
        'gtk2', 'gtk3', 'gtk4', 'gtkmm', 'gtksource', 'libadwaita', 'granite',
        'qt5', 'qt6', 'qt5ct', 'qt6ct', 'qca', 'qcoro', 'wxwidgets', 'fltk',
        'sdl', 'sdl2', 'sdl3', 'sfml', 'glfw', 'glew', 'freeglut', 'pyside'
    ],
    'Multimedia Libraries & Codecs': [
        'ffmpeg', 'gstreamer', 'gst-', 'x264', 'x265', 'aom', 'dav1d', 'rav1e',
        'svt-', 'libvpx', 'libtheora', 'mpg123', 'lame', 'opus', 'speex', 'vorbis',
        'faac', 'faad', 'libfdk', 'opencore', 'libbs2b', 'libmad', 'libmodplug',
        'libmp', 'libmusic', 'libsample', 'libshout', 'libsoxr', 'wavpack', 'libcue',
        'libdisc', 'libcdio', 'cdparanoia', 'libdvd', 'libbluray', 'libdca', 'liba52',
        'a52dec', 'aalib', 'libcaca', 'chromaprint', 'taglib', 'id3lib', 'flac',
        'mjpeg', 'libass', 'xvid', 'libmpeg2', 'ffmpegthumb', 'mlt', 'vlc-plugin'
    ],
    'Data & Databases': [
        'sqlite', 'db', 'gdbm', 'lmdb', 'leveldb', 'mariadb', 'mysql', 'postgresql',
        'mongodb', 'redis', 'memcached', 'dbeaver', 'pgadmin'
    ],
    'Virtualization & Emulation': [
        'qemu', 'virtualbox', 'virt-', 'libvirt', 'edk2', 'seabios', 'spice',
        'virgl', 'virtio', 'docker', 'containerd', 'runc', 'podman', 'buildah',
        'wine', 'lutris', 'proton', 'gamemode', 'gamescope', 'mangohud'
    ],
    'Fonts': [
        'ttf-', 'otf-', 'noto-fonts', 'cantarell', 'gnu-free-fonts', 'gsfonts',
        'font-', 'fonts-', 'woff2-font'
    ],
    'Icons & Themes': [
        'adwaita-icon', 'adwaita-cursor', 'papirus', 'breeze-icon', 'oxygen-icon',
        'hicolor-icon', 'sound-theme', 'ocean-sound', 'aurorae', 'bibata-cursor',
        'xcursor', 'default-cursor', 'oxygen-sounds', 'lxappearance'
    ],
    'Core Libraries (Low-Level)': [
        'glibc', 'gcc-libs', 'zlib', 'bzip2', 'xz', 'lz4', 'lzo', 'zstd', 'libarchive',
        'libxml2', 'libxslt', 'expat', 'pcre', 'glib2', 'glibmm', 'libffi', 'ncurses',
        'readline', 'icu', 'harfbuzz', 'freetype2', 'fontconfig', 'cairo', 'cairomm',
        'pango', 'pangomm', 'pixman', 'gdk-pixbuf', 'librsvg', 'libepoxy', 'graphene',
        'graphite', 'fribidi', 'libunistring', 'libunibreak', 'iniparser', 'json-',
        'jsoncpp', 'yyjson', 'simdjson', 'tomlplusplus', 'libyaml', 'libxmlb',
        'pugixml', 'yaml-cpp', 'jansson', 'msgpack', 'protobuf', 'zeromq', 'nettle',
        'mbedtls', 'libtasn1', 'libb2', 'xxhash', 'libmd', 'libbsd', 'libelf',
        'elfutils', 'libunwind', 'libtrace', 'liburing', 'liburcu', 'libaio',
        'libatomic', 'jemalloc', 'boost-libs', 'abseil', 'fmt', 'spdlog', 'libevent',
        'libuv', 'libev', 'c-ares', 'llhttp', 'http-parser', 'nghttp', 'libcurl',
        'libsoup', 'libproxy', 'libnice', 'libdata', 'srtp', 'libsrtp', 'opus',
        'portaudio', 'lmdb', 'lib', 'talloc', 'tdb', 'tevent', 'ldb', 'wbclient',
        'libnm', 'libnma', 'libmbim', 'libqmi', 'libndp', 'libteam', 'libusb',
        'libusbmuxd', 'libimobiledevice', 'libplist', 'hwdata', 'pciutils', 'dmidecode',
        'libdrm', 'mesa', 'ocl-icd', 'clinfo', 'libva', 'libvdpau', 'libglvnd',
        'libepoxy', 'glew', 'glad', 'glfw', 'freeglut', 'glu', 'glm', 'libjpeg',
        'libpng', 'libtiff', 'libwebp', 'giflib', 'jasper', 'openjpeg', 'jbig',
        'libavif', 'libjxl', 'libheif', 'libraw', 'libexif', 'exempi', 'exiv2',
        'libiptc', 'opencv', 'vigra', 'vips', 'gegl', 'babl', 'lcms2', 'libmng',
        'libyuv', 'libplacebo', 'zimg', 'vapoursynth', 'libaom', 'libde265',
        'libdav1d', 'libogg', 'libvorbis', 'lilv', 'lv2', 'serd', 'sord', 'sratom',
        'ladspa', 'aubio', 'liblo', 'rtmidi', 'rtaudio', 'openal', 'freealut',
        'sdl_', 'allegro', 'raylib', 'assimp', 'opensubdiv', 'openvdb', 'alembic',
        'openimage', 'opencolor', 'openexr', 'imath', 'ptex', 'material', 'usd',
        'draco', 'meshopt', 'tinyobj', 'cgal', 'eigen', 'armadillo', 'blas', 'cblas',
        'lapack', 'openblas', 'gsl', 'fftw', 'kissfft', 'tbb', 'onetbb', 'opencl',
        'cuda', 'boost', 'poco', 'folly', 'range', 'backward', 'cpptrace', 'libback',
        'libdwarf', 'libdw', 'binutils', 'libiberty', 'patchelf', 'chrpath',
        'debugedit', 'breakpad', 'crashpad', 'sentry', 'libtool', 'libltdl',
        'libiconv', 'gettext', 'intltool', 'pkg-config', 're2c', 'ragel', 'lemon',
        'antlr', 'libedit', 'editline', 'termcap', 'libterm', 'slang', 'newt',
        'libnewt', 'dialog', 'whiptail', 'cdialog', 'libcdk', 'libmenu', 'libpanel',
        'libform', 'libuuid', 'util-linux-libs', 'libblkid', 'libmount', 'libsmart',
        'libfdisk', 'systemd-libs', 'eudev', 'libudev', 'libinih', 'libdaemon',
        'libsystemd', 'cracklib', 'apparmor', 'selinux', 'libselinux', 'libsepol',
        'libsemanage', 'acl', 'attr', 'libacl', 'libattr', 'xattr', 'file', 'libmagic',
        'tree-sitter', 'libsixel', 'chafa', 'libcaca', 'aalib', 'jp2a', 'libqrencode',
        'qrencode', 'libdmtx', 'dmtx', 'zbar', 'libzbar', 'zxing', 'quirc',
        'libuchardet', 'uchardet', 'chardet', 'enca', 'libenca', 'recode', 'dos2unix',
        'convmv', 'iconv', 'libiconv', 'icu4c', 'boost-locale', 'libutf', 'utf8proc',
        'unicode', 'cldr', 'glibc-locale', 'liblouis', 'hyphen', 'hunspell', 'aspell',
        'ispell', 'pspell', 'enchant', 'nuspell', 'voikko', 'libvoikko', 'mythes',
        'libmythes', 'wordnet', 'libxapian', 'xapian', 'whoosh', 'lucene', 'solr',
        'elasticsearch', 'sphinx', 'tantivy', 'meilisearch', 'tslib', 'at-spi2',
        'atkmm', 'double-conversion', 'duktape', 'hidapi', 'highway', 'hunspell',
        'hwloc', 'hyphen', 'imlib2', 'imath', 'liblzf', 'libltc', 'libluv', 'libmad',
        'libmalcontent', 'libmanette', 'libmaxminddb', 'libmfx', 'libmicrodns',
        'libmm-glib', 'libmnl', 'libmpc', 'libmpcdec', 'libmpdclient', 'libmsym',
        'libmtp', 'libmwaw', 'libmysofa', 'libnautilus', 'libnet', 'libnetfilter',
        'libnewt', 'libnf', 'libnice', 'libnl', 'libnotify', 'libnsl', 'libnumber',
        'libnvme', 'libodfgen', 'libolm', 'libopenmpt', 'liborcus', 'libosinfo',
        'libpagemaker', 'libpaper', 'libpcap', 'libpciaccess', 'libpgm', 'libphone',
        'libplacebo', 'libportal', 'libpsl', 'libpulse', 'libqaccessibility',
        'libqalculate', 'libqrtr', 'libquotient', 'libqxp', 'libraqm', 'libraw1394',
        'librevenge', 'librsync', 'libsasl', 'libshout', 'libsigc', 'libsixel',
        'libslirp', 'libsm', 'libspectre', 'libspeechd', 'libspelling', 'libstaroffice',
        'libstemmer', 'libsysprof', 'libvisio', 'libvlc', 'libvnc', 'libvpl',
        'libvterm', 'libwacom', 'libwpd', 'libwps', 'libx11', 'libxau', 'libxaw',
        'libxcb', 'libxcomposite', 'libxcrypt', 'libxcursor', 'libxcvt', 'libxdamage',
        'libxdmcp', 'libxdp', 'libxext', 'libxfce4util', 'libxfixes', 'libxfont',
        'libxft', 'libxi', 'libxinerama', 'libxkb', 'libxklavier', 'libxmu',
        'libxnvctrl', 'libxpm', 'libxpresent', 'libxrandr', 'libxrender', 'libxsh',
        'libxss', 'libxt', 'libxtst', 'libxv', 'libxvmc', 'libxxf86vm', 'libzip',
        'libzmf', 'semver', 'snappy', 'sndio', 'soundtouch', 'source-highlight',
        'spandsp', 'spglib', 'tslib', 'uchardet', 'unibilium', 'uthash', 'verdict',
        'vid.stab', 'vmaf', 'volume_key', 'vte', 'vtk', 'wildmidi', 'xcb-',
        'xerces-c', 'xfconf', 'xmlsec', 'xorgproto', 'xsettingsd'
    ]
}

def categorize_package(package_name: str) -> str:
    """
    Categorize a package based on its name using pattern matching.
    """
    name_lower = package_name.lower()
    
    # Check each category's patterns
    for category, patterns in CATEGORY_PATTERNS.items():
        for pattern in patterns:
            if pattern in name_lower:
                return category
    
    # Default categorization for remaining packages
    if name_lower.startswith('lib'):
        return 'Core Libraries (Low-Level)'
    elif 'python-' in name_lower:
        return 'Programming Languages & Runtimes'
    elif 'perl-' in name_lower:
        return 'Programming Languages & Runtimes'
    elif any(x in name_lower for x in ['gst-', 'codec', 'video', 'audio']):
        return 'Multimedia Libraries & Codecs'
    else:
        return 'Core Libraries (Low-Level)'

def generate_description(package_name: str, category: str) -> str:
    """
    Generate a plausible description for a package based on its name and category.
    """
    descriptions = {
        'System Core': f"Essential system component: {package_name}",
        'System Services & Daemons': f"Background service providing {package_name} functionality",
        'Display & Graphics': f"Graphics and display component for {package_name}",
        'Audio Subsystem': f"Audio processing library or daemon: {package_name}",
        'Networking': f"Network connectivity tool: {package_name}",
        'Security & Encryption': f"Security and cryptography package: {package_name}",
        'Command-line Utilities': f"Command-line utility: {package_name}",
        'Arch Linux & AUR Helpers': f"Arch Linux package management tool: {package_name}",
        'Desktop Environment (General)': f"Desktop environment component: {package_name}",
        'KDE Plasma Components': f"KDE Plasma framework component: {package_name}",
        'User Applications (GUI)': f"Graphical user application: {package_name}",
        'Development Tools & IDEs': f"Development tool: {package_name}",
        'Programming Languages & Runtimes': f"Programming language runtime or library: {package_name}",
        'GUI Toolkits': f"Graphical user interface toolkit: {package_name}",
        'Multimedia Libraries & Codecs': f"Multimedia codec or library: {package_name}",
        'Data & Databases': f"Database system or client: {package_name}",
        'Virtualization & Emulation': f"Virtualization component: {package_name}",
        'Fonts': f"Font package: {package_name}",
        'Icons & Themes': f"Icon theme or cursor theme: {package_name}",
        'Core Libraries (Low-Level)': f"Low-level system library: {package_name}"
    }
    
    return descriptions.get(category, f"Package: {package_name}")