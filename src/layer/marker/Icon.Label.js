/*
     Author: Artem Groznykh
Description: icon label with close button
             based on https://github.com/jacobtoye/Leaflet.git/iconLabel
*/

L.Icon.Label = L.Icon.extend({
	options: {
		/*
		labelAnchor: (Point) (top left position of the label within the wrapper, default is right)
		wrapperAnchor: (Point) (position of icon and label relative to Lat/Lng)
		iconAnchor: (Point) (top left position of icon within wrapper)
		labelText: (String) (label's text component, if this is null the element will not be created)
		closeButton: (boolean) (show close button on label top right corner)
		onCloseButtonClick: (function) (fires when user clicks close button on label)
		*/
		/* Icon options:
		iconUrl: (String) (required)
		iconSize: (Point) (can be set through CSS)
		iconAnchor: (Point) (centered by default if size is specified, can be set in CSS with negative margins)
		popupAnchor: (Point) (if not specified, popup opens in the anchor point)
		shadowUrl: (Point) (no shadow by default)
		shadowSize: (Point)
		*/
		labelClassName: '',
        closeButtonClassName: ''
	},
	
	initialize: function (options) {
		L.Util.setOptions(this, options);
		L.Icon.prototype.initialize.call(this, this.options);
	},

	createIcon: function () {
		return this._createLabel(L.Icon.prototype._createIcon.call(this, 'icon'));
	},
	
	createShadow: function () {
        if (!this.options.shadowUrl) {return; }
		var shadow = L.Icon.prototype._createIcon.call(this, 'shadow');
		//need to reposition the shadow
		if (shadow) {
			shadow.style.marginLeft = (-this.options.wrapperAnchor.x) + 'px';
			shadow.style.marginTop = (-this.options.wrapperAnchor.y) + 'px';
		}
		return shadow;
	},

	_createLabel: function (img) {
		var iconWrapper = document.createElement('div');
        iconWrapper.appendChild(img);

        var labelWrapper = L.DomUtil.create('div', '', iconWrapper),
            label = L.DomUtil.create('span', '', labelWrapper);

        labelWrapper.className = 'leaflet-marker-iconlabel ' + this.options.labelClassName;

        //do not show label if there is no text
        if (this.options.labelText) {
            label.innerHTML = this.options.labelText;
        } else {
            labelWrapper.style.display = 'none';
        }

        //show close button and bind handler
        if (this.options.closeButton) {
            var fn = this.options.onCloseButtonClick,
                closeButton = L.DomUtil.create('a', 'leaflet-marker-iconlabel-closebutton ' + this.options.closeButtonClassName, labelWrapper);
            closeButton.href = '#close';
            
            L.DomEvent.addListener(closeButton, 'click', function(e) {
                L.DomEvent.stop(e);
                if (fn && typeof fn === 'function') {
                    fn();
                } else {
                    this.parentNode.style.display = 'none';
                }
            });
        }

		//set up label's styles
		labelWrapper.style.marginLeft = this.options.labelAnchor.x + 'px';
		labelWrapper.style.marginTop = this.options.labelAnchor.y + 'px';
		
		//set up wrapper anchor
		iconWrapper.style.marginLeft = (-this.options.wrapperAnchor.x) + 'px';
		iconWrapper.style.marginTop = (-this.options.wrapperAnchor.y) + 'px';

        //do not show icon wrapper div
        iconWrapper.style.overflow = 'visible';
        iconWrapper.style.height = '0';

		iconWrapper.className = 'leaflet-marker-icon-wrapper';
		
		//reset icons margins (as super makes them -ve)
		img.style.marginLeft = this.options.iconAnchor.x + 'px';
		img.style.marginTop = this.options.iconAnchor.y + 'px';
		
		return iconWrapper;
	}
});

L.Icon.Label.Default = L.Icon.Label.extend({
	options: {
		//This is the top left position of the label within the wrapper. By default it will display at the right
		//middle position of the default icon. x = width of icon + padding
		//If the icon height is greater than the label height you will need to set the y value.
		//y = (icon height - label height) / 2
		labelAnchor: new L.Point(29, 8),
		
		//This is the position of the wrapper div. Use this to position icon + label relative to the Lat/Lng.
		//By default the point of the default icon is anchor
		wrapperAnchor: new L.Point(13, 41),
		
		//This is now the top left position of the icon within the wrapper.
		//If the label height is greater than the icon you will need to set the y value.
		//y = (label height - icon height) / 2
		iconAnchor: new L.Point(0, 0),
		
		//label's text component, if this is null the element will not be created
		labelText: null,

        //show closeButton on label or not
        closeButton: false,

        //fires when closeButton clicked
        onCloseButtonClick: undefined,
		
		/* From L.Icon.Default */
		iconUrl: L.ROOT_URL + 'images/marker.png',
		iconSize: new L.Point(25, 41),
		popupAnchor: new L.Point(0, -33),

		shadowUrl: L.ROOT_URL + 'images/marker-shadow.png',
		shadowSize: new L.Point(41, 41)
	}
});