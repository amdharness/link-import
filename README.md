# `link-import`
[![Dependencies][deps-image]][deps-url]
[![devDependencies][dev-deps-image]][dev-deps-url]
[![NPM version][npm-image]][npm-url]


`link-import!` AMD plugin for loading any WebComponents locally or over CDN 
as AMD dependencies list and implementation of WebComponent via AMD define() 

The code sniplet for AMD configuration sample from HTML page which uses 
Vaadin & Polymer Elements and custom  **af-branches** WebComponent:
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
                class 
            AfBranches extends Polymer.Element
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

# Why AMD for WebComponent?
AMD is a module loader which allows to switch module location just by config and 
does not require any transpilation. I.e. you will be working in browser without any 
source mapping making it a IDE for editing and debugging on native level.

Why not alternatives?
* **ES6 class imports**  does not have configuration for switching the 
path to dependencies. 
* **Transpiling** is the way around missing config API in ES6, It is
the source substitution on imports strings or even switching the source to 
runtime loader like AMD or System JS. WebPack, bower, etc are the samples.

In all work around the sources are moved into compiled bundle or generated in 
runtime, leaving developer to deal with extra complexity of mapping to original 
sources. 

Unlike work around AMD stands for KISS principle during development, still permitting 
the transpiling and bundling options. With HTTP2 and gzip compressing by web server 
the bundling is not actual anymore. 

About `stripping comments` in source. The author's opinion the code should be readable
by developer and structured in a way to make comments unnecessary. The complimentary 
comments and docs should be served in project documentation like this one rather 
embedded into code.
 
There are some solutions which allow to outsource the documentation to wiki like 
[ApiFusion](https://www.apifusion.com/wiki/index.php/AmdHarness.org/Sources/link-import). 
The source parsing and IDE integration are in progress there.    
 

# Plugin use
 ## setup
 There is only one file `link-import.js` you need. 
 You could pull it from NPM by `npm install --save link-import` or simply copy from github into your project. 
 Then use as dependency prefix. For example the following link
 ```html
      <link rel="import" href="/components/polymer/polymer-element.html">  
```
looks like `"node_modules/link-import/link-import!/components/polymer/polymer-element.html"`  
 
Since it is too verbose it is advised to make an alias 
in AMD config 

`aliases:  [ [ "link-import"  , "af/ui/AMD/link-import" ]...`

which  shorten it to `"link-import!/components/polymer/polymer-element.html"`
 
Further aliasing and package definitions will allow to trim the dependency string 
to bare minimum `"link-import!polymer/polymer-element.html"` 
(see config sample in intro)
 
## `|whenDefined` parameter
The `link-import!` prefix is resolved when `link` node `onload` event is fired. 
The WebComponent HTML loading is not necessary a final stage as AMD could be still 
in loading progress. To assure the WebComponent is completely ready to use, append 
`|whenDefined` to its URL: 
`"link-import!/components/apifusion/af-branches.html!whenDefined"`

As `af-branches` is implemented with AMD, it will wait for dependencies resolving 
and registering WebComponent, finally notifying the browser page over 
`window.customElements.whenDefined` callback. `!whenDefined` suffix will resolve 
the module on this event.    

## AMD resolved value 
The module returns the tag name guessed out of HTML name. 

# Demo
 * from `test/` folder run `polymer serve --open`. It will open `test/demo/index.html` 
 in browser.   
 * `af-branches` web component demo page(TBD)
 * This project `test-component` demo page on CDN (TBD) 
 
# Compatibility
 * For now it is tested against Dojo Toolkit 1.x AMD loader.
 * RequireJS seems does not support the named define() in SCRIPT tag resulting 
 in not invoking the callback, i.e. web component defined in HTML via 
 RequireJS define implementation will not be instantiated. 
 Absence of errors and console warnings preventing discover the cause. 
 We are looking for help in following the issue and fix for RequireJS. 
 * Please **create the ticket** if your AMD environment does not support define() 
 in HTML script section. Or **upvote** if ticket already created in "add reaction" 
 smile button next to ticket title.
 * IE does not support ES6 syntax which this plugin is written in.     
  
# test
## manual test
Open `test/demo/index.html` and run in browser
( IntelliJ IDEA allows to "open in browser" opened html, ALT-F2 on Windows)

## Test Automation
Smoke test: 
* `npm test`

Multi-browser test. Prepare project and run test by 
* `npm install`
* `cd test`
* `bower install`
* `polymer test`

Keep in mind the `polymer test` by default will run the test on all registered 
browsers in your OS. `-l` key allows to define the browser to test against. 
It is also quite slow and looks like frozen, to see the progress use: 

`polymer test --verbose -l chrome` 
  


[npm-image]:      https://img.shields.io/npm/v/link-import.svg
[npm-url]:        https://npmjs.org/package/link-import
[deps-image]:     https://img.shields.io/david/amdharness/link-import.svg
[deps-url]:       https://david-dm.org/amdharness/link-import
[dev-deps-image]: https://img.shields.io/david/dev/amdharness/link-import.svg
[dev-deps-url]:   https://david-dm.org/amdharness/link-import?type=dev
 
