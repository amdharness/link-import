define('link-import', function()
{
    return  {   load: function (name, req, onload /*, config */)
                {
                    // req has the same API as require()
                    let mid = name.split('|')[0]
                    ,   url = req.toUrl( mid )
                    ,   orig_name = mid.substring( mid.lastIndexOf('/')+1, mid.lastIndexOf('.') );
                    importHref( url, function()
                    {
                        if( name.includes('|whenDefined') )// "link-import!iron-demo-helpers/demo-snippet.html|whenDefined"
                            window.customElements.whenDefined(orig_name)
                                  .then( ()=>orig_name )
                                  .then( onload, onError);
                        else
                            onload( orig_name );
                    }, onError );
                    function onError(err)
                    {   const msg = `${orig_name} - ERROR ${err} - ${url}`;
                        console.error(msg, err);
                        onload(orig_name+"-error");
                    }
                }
            ,   importHref : importHref
            };

        function 
    importHref( href, onload, onerror, optAsync ) // Polymer.importHref clone
    {
        let link = /** @type {HTMLLinkElement} */
                (document.head.querySelector( 'link[href="' + href + '"][import-href]' ));
        if( !link )
        {
            link      = /** @type {HTMLLinkElement} */ (document.createElement( 'link' ));
            link.rel  = 'import';
            link.href = href;
            link.setAttribute( 'import-href', '' );
        }
        // always ensure link has `async` attribute if user specified one,
        // even if it was previously not async. This is considered less confusing.
        if( optAsync )
        {
            link.setAttribute( 'async', '' );
        }
        // NOTE: the link may now be in 3 states: (1) pending insertion,
        // (2) inflight, (3) already loaded. In each case, we need to add
        // event listeners to process callbacks.
        let cleanup       = function() {
            link.removeEventListener( 'load', loadListener );
            link.removeEventListener( 'error', errorListener );
        };
        let loadListener  = function( event ) {
            cleanup();
            // In case of a successful load, cache the load event on the link so
            // that it can be used to short-circuit this method in the future when
            // it is called with the same href param.
            link.__dynamicImportLoaded = true;
            if( onload )
            {
                whenImportsReady( () => {
                    onload( event );
                } );
            }
        };
        let errorListener = function( event ) {
            cleanup();
            // In case of an error, remove the link from the document so that it
            // will be automatically created again the next time `importHref` is
            // called.
            if( link.parentNode )
            {
                link.parentNode.removeChild( link );
            }
            if( onerror )
            {
                whenImportsReady( () => {
                    onerror( event );
                } );
            }
        };
        link.addEventListener( 'load', loadListener );
        link.addEventListener( 'error', errorListener );
        if( link.parentNode === null )
        {
            document.head.appendChild( link );
            // if the link already loaded, dispatch a fake load event
            // so that listeners are called and get a proper event argument.
        }else if( link.__dynamicImportLoaded )
        {
            link.dispatchEvent( new Event( 'load' ) );
        }
        return link;
    }
        function
    whenImportsReady( cb )
    {   window.HTMLImports
        ?    HTMLImports.whenReady( cb )
        :    cb();
    }

});