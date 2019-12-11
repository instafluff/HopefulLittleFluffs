function getMeta( element, metaName ) {
  return element.querySelector( `meta[itemprop="${metaName}"]` ).getAttribute( "content" );
}
