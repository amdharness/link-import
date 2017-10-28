# `link-import`
[![Dependencies][deps-image]][deps-url]
[![devDependencies][dev-deps-image]][dev-deps-url]
[![NPM version][npm-image]][npm-url]


link-import! AMD plugin for loading WebComponents locally and over CDN 
in AMD dependencies list and implementation of WebComponent via AMD define() 

The code sniplet for AMD configuration sample from HTML page which uses 
Vaadin & Polymer Elements and custom  **af-branches** WebComponent
```html

    <script src="../bower_components/marked/marked.min.js"  ></script>
    <script>
        let useCDN = location.href.includes('usecdn')
        ,   cdn_root = 'https://cdn.xml4jquery.com/ajax/libs/components'
        ,   vaadin_root         =!useCDN ? '/components'        : `${cdn_root}` // 'https://cdn.vaadin.com/vaadin-elements/latest'
        ,   webcomponent_root   =!useCDN ? "/components"        : `${cdn_root}/webcomponentsjs`
        ,   polymer_root        =!useCDN ? "/components/polymer": `${cdn_root}/polymer`
        ,   iron_root           =!useCDN ? '/components'        : `${cdn_root}` ;
        var dojoConfig ={ async: true
                        , packages:
                            [ { name: "af", location: "/af/ApiFusion.org-folders" }
//                            , { name: "iron-demo-helpers", location: "/components/iron-demo-helpers" }
                            , { name: "webcomponentsjs", location: webcomponent_root }
                            , { name: "polymer", location: polymer_root }
                            ]
                        , aliases:  [ [ "link-import"  , "af/ui/AMD/link-import" ]
                                    , [ /(vaadin-)(.*)/, (m,x,y)=>`${vaadin_root}/${x}${y}` ]
                                    , [ /(iron-)(.*)/  , (m,x,y)=>`${iron_root}/${x}${y}`   ]
                                    ]
                        , deps: []
                        };
    </script>
    <script src="https://ajax.googleapis.com/ajax/libs/dojo/1.12.2/dojo/dojo.js.uncompressed.js" ></script>
    <script>
require([   "webcomponentsjs/webcomponents-lite"
        ,   "link-import!iron-demo-helpers/demo-pages-shared-styles.html|onload"
        ,   "link-import!iron-demo-helpers/demo-snippet.html"
        ,   "link-import!../af-branches.html"
        ], (a,b,c,d)=> console.log(` ${a} ${b} ${c} ${d}`) );
    </script>

```

The **af-branches** WebComponent is using AMD define():
```html
<dom-module id="af-branches">
...
    <script>
        define('af-branches',   [   "link-import!polymer/polymer-element.html|onload"
                                ,   "link-import!iron-ajax/iron-ajax.html"
                                ,   "link-import!vaadin-material-theme/vaadin-text-field.html" //,   "link-import!vaadin-valo-theme/vaadin-combo-box.html"
                                ,   "link-import!vaadin-combo-box/vaadin-combo-box.html"
                                ],(polymerElement)=>
        {

            /**
             * `af-branches`
             * Version control Branches selector out of Implementation namespace headers of ApiFusion git source import mediawiki page
             *
             * @customElement
             * @polymer
             * @demo demo/index.html
             */
            class AfBranches extends Polymer.Element
            {
                static get is() { return 'af-branches'; }
                ...
            }

            window.customElements.define( AfBranches.is, AfBranches );
            return AfBranches;
        });
        require(['af-branches']);
    </script>
</dom-module>

```
The require() which immediately follows define() is needed to enforce WebComponent registration.



[npm-image]:      https://img.shields.io/npm/v/link-import.svg
[npm-url]:        https://npmjs.org/package/link-import
[deps-image]:     https://img.shields.io/david/amdharness/link-import.svg
[deps-url]:       https://david-dm.org/amdharness/link-import
[dev-deps-image]: https://img.shields.io/david/dev/amdharness/link-import.svg
[dev-deps-url]:   https://david-dm.org/amdharness/link-import?type=dev
 