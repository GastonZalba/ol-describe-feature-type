/**
 * @module ol/format/DescribeFeatureType
 */
import XML from 'ol/format/XML.js';
import {
  makeArrayPusher,
  makeObjectPropertySetter,
  makeStructureNS,
  pushParseAndPop,
} from 'ol/xml.js';
import {
  readBooleanString
} from 'ol/format/xsd.js';

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
const PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'complexType': makeObjectPropertySetter(readComplexType),
  'import': makeObjectPropertySetter(readImport),
  'element': makeObjectPropertySetter(readElement_)
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
    const describeFeatureTypeObject = pushParseAndPop(
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
const COMPLEX_TYPE_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'complexContent': makeObjectPropertySetter(readComplexContent)
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const COMPLEX_CONTENT_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'extension': makeObjectPropertySetter(readExtension),
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const EXTENSION_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'sequence': makeObjectPropertySetter(readSequence)
});

/**
 * @const
 * @type {Object<string, Object<string, import("ol/xml.js").Parser>>}
 */
// @ts-ignore
const SEQUENCE_PARSERS = makeStructureNS(NAMESPACE_URIS, {
  'element': makeArrayPusher(readElement)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Capability object.
 */
function readComplexType(node, objectStack) {
  return pushParseAndPop({}, COMPLEX_TYPE_PARSERS, node, objectStack);
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
  return pushParseAndPop({}, COMPLEX_CONTENT_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Contact person object.
 */
function readExtension(node, objectStack) {
  return pushParseAndPop({}, EXTENSION_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Contact person object.
 */
function readSequence(node, objectStack) {
  return pushParseAndPop([], SEQUENCE_PARSERS, node, objectStack);
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
    'nillable': readBooleanString(node.getAttribute('unitSymbol')),
    'minOccurs': Number(node.getAttribute('minOccurs')),
    'maxOccurs': Number(node.getAttribute('maxOccurs')),
    'type': node.getAttribute('type'),
    'localType': node.getAttribute('type').split(':')[1]
  };
  return elementObject;
}

export default DescribeFeatureType;