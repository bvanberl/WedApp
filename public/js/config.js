angular.module('CustomTheme', ['ngMaterial']).config(function ($mdThemingProvider) {
    var customPrimary = {
        '50': '#c0c0c0',
        '100': '#b3b3b3',
        '200': '#a6a6a6',
        '300': '#999999',
        '400': '#8d8d8d',
        '500': '#808080',
        '600': '#737373',
        '700': '#666666',
        '800': '#5a5a5a',
        '900': '#4d4d4d',
        'A100': '#cccccc',
        'A200': '#d9d9d9',
        'A400': '#e6e6e6',
        'A700': '#404040'
    };
    $mdThemingProvider
        .definePalette('customPrimary',
                        customPrimary);

    var customAccent = {
        '50': '#e2a74a',
        '100': '#e5b160',
        '200': '#e9bc76',
        '300': '#ecc78c',
        '400': '#f0d2a2',
        '500': '#f3dcb8',
        '600': '#fbf2e4',
        '700': '#fefcfa',
        '800': '#ffffff',
        '900': '#ffffff',
        'A100': '#fbf2e4',
        'A200': '#F7E7CE',
        'A400': '#f3dcb8',
        'A700': '#ffffff'
    };
    $mdThemingProvider
        .definePalette('customAccent',
                        customAccent);

    var customWarn = {
        '50': '#ff8080',
        '100': '#ff6666',
        '200': '#ff4d4d',
        '300': '#ff3333',
        '400': '#ff1a1a',
        '500': '#ff0000',
        '600': '#e60000',
        '700': '#cc0000',
        '800': '#b30000',
        '900': '#990000',
        'A100': '#ff9999',
        'A200': '#ffb3b3',
        'A400': '#ffcccc',
        'A700': '#800000'
    };
    $mdThemingProvider
        .definePalette('customWarn',
                        customWarn);

  var customBackground = {
    '50': '#f9f9f9',
      '100': '#ececec',
      '200': '#dfdfdf',
      '300': '#d2d2d2',
      '400': '#c6c6c6',
      '500': '#b9b9b9',
      '600': '#acacac',
      '700': '#9f9f9f',
      '800': '#939393',
      '900': '#868686',
      'A100': '#ffffff',
      'A200': '#ffffff',
      'A400': '#ffffff',
      'A700': '#797979'
    };
    $mdThemingProvider
        .definePalette('customBackground',
                        customBackground);

   $mdThemingProvider.theme('wedappTheme')
       .primaryPalette('customPrimary')
       .accentPalette('customAccent')
       .warnPalette('customWarn')
       .backgroundPalette('customBackground')
});
