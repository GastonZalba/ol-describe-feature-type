
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol/format/XML.js'), require('ol/xml.js'), require('ol/format/xsd.js')) :
  typeof define === 'function' && define.amd ? define(['ol/format/XML.js', 'ol/xml.js', 'ol/format/xsd.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DescribeFeatureType = factory(global.ol.format.XML, global.ol.xml, global.ol.format.xsd));
})(this, (function (XML, xml_js, xsd_js) { 'use strict';

  /**
   * @module ol/format/DescribeFeatureType
   */

  /**
   * @const
   * @type {Array<null|string>}
   */
  const NAMESPACE_URIS = [
      null, 
      'http://www.opengis.net/wfs',
      'http://www.opengis.net/wfs/2.0',
      'http://www.opengis.net/gml',
      'http://www.opengis.net/gml/3.2',
      'http://www.w3.org/2001/XMLSchema'
  ];

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'complexType': xml_js.makeObjectPropertySetter(readComplexType),
    'import': xml_js.makeObjectPropertySetter(readImport),
    'element': xml_js.makeObjectPropertySetter(readElement_)
  });

  /**
   * @classdesc
   * Format for reading WMS capabilities data
   *
   * @api
   */
  class DescribeFeatureType extends XML {
    constructor() {
      super();
    }

    /**
     * @param {Element} node Node.
     * @return {Object|null} Object
     */
    readFromNode(node) {
      const describeFeatureTypeObject = xml_js.pushParseAndPop(
        {
          'elementFormDefault': node.getAttribute('elementFormDefault'),
          'targetNamespace': node.getAttribute('targetNamespace')
        },
        PARSERS,
        node,
        [],
      );
      return describeFeatureTypeObject ? describeFeatureTypeObject : null;
    }

    /**
     * Read the source document.
     *
     * @param {Document|Element|string} source The XML source.
     * @return {Object} An object representing the source emulating a native json response.
     * @api
     */
    readFormated(source) {
      const data = this.read(source);

      return {
        elementFormDefault: data.elementFormDefault,
        targetNamespace: data.targetNamespace,
        featureTypes: data.complexType.complexContent.extension.sequence.map(e => e)
      }
    }
  }

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const COMPLEX_TYPE_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'complexContent': xml_js.makeObjectPropertySetter(readComplexContent)
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const COMPLEX_CONTENT_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'extension': xml_js.makeObjectPropertySetter(readExtension),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const EXTENSION_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'sequence': xml_js.makeObjectPropertySetter(readSequence)
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SEQUENCE_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'element': xml_js.makeArrayPusher(readElement)
  });

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Capability object.
   */
  function readComplexType(node, objectStack) {
    return xml_js.pushParseAndPop({}, COMPLEX_TYPE_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Element object.
   */
  function readImport(node, objectStack) {
    const importObject = {
      'namespace': node.getAttribute('namespace'),
      'schemaLocation': node.getAttribute('schemaLocation')
    };
    return importObject;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Element object.
   */
  function readElement_(node, objectStack) {
    const elementObject = {
      'name': node.getAttribute('name'),
      'substitutionGroup': node.getAttribute('substitutionGroup'),
      'type': node.getAttribute('type')
    };
    return elementObject;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Contact information object.
   */
  function readComplexContent(node, objectStack) {
    return xml_js.pushParseAndPop({}, COMPLEX_CONTENT_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Contact person object.
   */
  function readExtension(node, objectStack) {
    return xml_js.pushParseAndPop({}, EXTENSION_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Contact person object.
   */
  function readSequence(node, objectStack) {
    return xml_js.pushParseAndPop([], SEQUENCE_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object} Dimension object.
   */
  function readElement(node, objectStack) {
    const elementObject = {
      'name': node.getAttribute('name'),
      'units': node.getAttribute('units'),
      'nillable': xsd_js.readBooleanString(node.getAttribute('unitSymbol')),
      'minOccurs': Number(node.getAttribute('minOccurs')),
      'maxOccurs': Number(node.getAttribute('maxOccurs')),
      'type': node.getAttribute('type'),
      'localType': node.getAttribute('type').split(':')[1]
    };
    return elementObject;
  }

  return DescribeFeatureType;

}));
//# sourceMappingURL=DescribeFeatureType.js.map
