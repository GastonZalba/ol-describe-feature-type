
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
    "http://www.opengis.net/gml",
    "http://www.opengis.net/gml/3.2",
    "http://www.w3.org/2001/XMLSchema",
    "http://www.opengis.net/ows/1.1",
  ];

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    complexType: xml_js.makeObjectPropertyPusher(readComplexType),
    import: xml_js.makeObjectPropertySetter(readImport),
    element: xml_js.makeObjectPropertyPusher(readElement_),
    Exception: xml_js.makeObjectPropertyPusher(readException),
  });

  /**
   * @classdesc
   * Format for reading Describe Feature Type GML data
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
      const isException = node.tagName === "ows:ExceptionReport";
      const describeFeatureTypeObject = xml_js.pushParseAndPop(
        isException
          ? {
              version: node.getAttribute("version"),
            }
          : {
              elementFormDefault: node.getAttribute("elementFormDefault"),
              targetNamespace: node.getAttribute("targetNamespace"),
              targetPrefix: readTargetPrefix(node),
            },
        PARSERS,
        node,
        []
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

      return data.Exception
        ? {
            version: data.version,
            exceptions: data.Exception.map((e) => ({
              code: e.exceptionCode,
              locator: e.locator,
              text: e.ExceptionText,
            })),
          }
        : {
            elementFormDefault: data.elementFormDefault,
            targetNamespace: data.targetNamespace,
            targetPrefix: data.targetPrefix,
            featureTypes: data.complexType.map((e) => ({
              typeName: data.element.name,
              properties: e.complexContent.extension.sequence,
            })),
          };
    }
  }

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const COMPLEX_TYPE_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    complexContent: xml_js.makeObjectPropertySetter(readComplexContent),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const COMPLEX_CONTENT_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    extension: xml_js.makeObjectPropertySetter(readExtension),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const EXTENSION_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    sequence: xml_js.makeObjectPropertySetter(readSequence),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const SEQUENCE_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    element: xml_js.makeArrayPusher(readElement),
  });

  /**
   * @const
   * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
   */
  // @ts-ignore
  const EXCEPTION_TEXT_PARSERS = xml_js.makeStructureNS(NAMESPACE_URIS, {
    'ExceptionText': xml_js.makeObjectPropertySetter(xsd_js.readString),
  });


  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Capability object.
   */
  function readComplexTypeContent(node, objectStack) {
    return xml_js.pushParseAndPop({}, COMPLEX_TYPE_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Exception text object.
   */
  function readExceptionText(node, objectStack) {
    return xml_js.pushParseAndPop({}, EXCEPTION_TEXT_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Capability object.
   */
  function readComplexType(node, objectStack) {
    const complexType = readComplexTypeContent(node, objectStack);
    if (complexType) {
      complexType["name"] = node.getAttribute("name");
      return complexType;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Element object.
   */
  function readImport(node, objectStack) {
    const importObject = {
      namespace: node.getAttribute("namespace"),
      schemaLocation: node.getAttribute("schemaLocation"),
    };
    return importObject;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Element object.
   */

  function readException(node, objectStack) {
    const exceptionObject = readExceptionText(node, objectStack);
    if (exceptionObject) {
      exceptionObject["exceptionCode"] = node.getAttribute("exceptionCode");
      exceptionObject["locator"] = node.getAttribute("locator");
      return exceptionObject;
    }
    return undefined;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Element object.
   */
  function readElement_(node, objectStack) {
    const elementObject = {
      name: node.getAttribute("name"),
      substitutionGroup: node.getAttribute("substitutionGroup"),
      type: node.getAttribute("type"),
    };
    return elementObject;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Complex Content object.
   */
  function readComplexContent(node, objectStack) {
    return xml_js.pushParseAndPop({}, COMPLEX_CONTENT_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object|undefined} Extension object.
   */
  function readExtension(node, objectStack) {
    return xml_js.pushParseAndPop({}, EXTENSION_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array|undefined} Sequence array.
   */
  function readSequence(node, objectStack) {
    return xml_js.pushParseAndPop([], SEQUENCE_PARSERS, node, objectStack);
  }

  /**
   * @param {Element} node Node.
   * @return {string|undefined} Target Prefix.
   */
  function readTargetPrefix(node) {
    const attributes = node.attributes;
    let prefix = "";
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i].name.split(":")[1];
      if (attr && !["xsd", "xs", "gml", "wfs"].includes(attr)) {
        prefix = attr;
      }
    }
    return prefix;
  }

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Object} Dimension object.
   */
  function readElement(node, objectStack) {
    const elementObject = {
      name: node.getAttribute("name"),
      maxOccurs: Number(node.getAttribute("maxOccurs")),
      minOccurs: Number(node.getAttribute("minOccurs")),
      nillable: xsd_js.readBooleanString(node.getAttribute("nillable")),
      type: node.getAttribute("type"),
      localType: node.getAttribute("type").split(":")[1],
    };
    return elementObject;
  }

  return DescribeFeatureType;

}));
//# sourceMappingURL=DescribeFeatureType.js.map
