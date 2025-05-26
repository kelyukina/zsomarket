window.BX_YMapAddPlacemark = function(map, arPlacemark, isClustered){
	if (null == map)
		return false;

	if(!arPlacemark.LAT || !arPlacemark.LON)
		return false;

	var markerSVG = ymaps.templateLayoutFactory.createClass([
'<svg width="46" height="57" viewBox="0 0 46 57">',
'<defs><style>.cls-marker, .cls-marker3 {fill: #fff;}.cls-marker, .cls-marker2 {fill-rule: evenodd;}.cls-marker {opacity: 0.5;}.cls-marker2 {fill: #247ee3;}</style></defs>',
'<path data-name="Ellipse 275 copy" class="cls-marker" d="M142.976,200.433L143,200.469s-7.05,5.826-10,10.375c-2.263,3.489-2.974,6.153-5,6.156s-2.737-2.667-5-6.156c-2.95-4.549-10-10.375-10-10.375l0.024-.036A23,23,0,1,1,142.976,200.433Z" transform="translate(-105 -160)"/>',
'<path data-name="Ellipse 253 copy 4" class="cls-marker2" d="M140,198.971L140,199s-6.362,5.91-8.092,8.456C128.351,212.69,128,215,128,215s-0.307-2.084-3.826-7.448C121.8,203.935,116,199,116,199l0-.029A20,20,0,1,1,140,198.971Z" transform="translate(-105 -160)"/>',
'<circle data-name="Ellipse 254 copy 5" class="cls-marker3" cx="23" cy="23" r="12"/>',
'</svg>'
].join(''));
	
	var props = {};
	if (null != arPlacemark.TEXT && arPlacemark.TEXT.length > 0)
	{
		var value_view = '';

		if (arPlacemark.TEXT.length > 0)
		{
			var rnpos = arPlacemark.TEXT.indexOf("\n");
			value_view = rnpos <= 0 ? arPlacemark.TEXT : arPlacemark.TEXT.substring(0, rnpos);
		}

		// hz
		props.balloonContent = arPlacemark.TEXT.replace(/\n/g, '<br />');

		props.balloonContent = arPlacemark.TEXT;


		props.hintContent = value_view;
	}
	var option = {
		iconImageSize: [46, 57],
		// iconImageOffset: [-24, -30],
		iconImageOffset: [-23, -28],
		item: arPlacemark.ITEM_ID,
		iconLayout: markerSVG
	};

	var obPlacemark = new ymaps.Placemark(
		[parseFloat(arPlacemark.LAT), parseFloat(arPlacemark.LON)],
		props,
		option,
		{balloonCloseButton: true}
	);

	if(!isClustered) { map.geoObjects.add(obPlacemark); }

	return obPlacemark;
}

if (!window.BX_YMapAddPolyline)
{
	window.BX_YMapAddPolyline = function(map, arPolyline)
	{
		if (null == map)
			return false;

		if (null != arPolyline.POINTS && arPolyline.POINTS.length > 1)
		{
			var arPoints = [];
			for (var i = 0, len = arPolyline.POINTS.length; i < len; i++)
			{
				arPoints.push([arPolyline.POINTS[i].LAT, arPolyline.POINTS[i].LON]);
			}
		}
		else
		{
			return false;
		}

		var obParams = {clickable: true};
		if (null != arPolyline.STYLE)
		{
			obParams.strokeColor = arPolyline.STYLE.strokeColor;
			obParams.strokeWidth = arPolyline.STYLE.strokeWidth;
		}
		var obPolyline = new ymaps.Polyline(
			arPoints, {balloonContent: arPolyline.TITLE}, obParams
		);

		map.geoObjects.add(obPolyline);

		return obPolyline;
	}
}