export default DescribeFeatureType;
/**
 * @classdesc
 * Format for reading Describe Feature Type GML data
 *
 * @api
 */
declare class DescribeFeatureType extends XML {
    /**
     * Read the source document.
     *
     * @param {Document|Element|string} source The XML source.
     * @return {Object} An object representing the source emulating a native geoserver/mapserver json response.
     * @api
     */
    readFormatted(source: Document | Element | string): any;
}
import XML from 'ol/format/XML.js';
//# sourceMappingURL=DescribeFeatureType.d.ts.map