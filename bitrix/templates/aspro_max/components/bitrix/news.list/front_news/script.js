$(document).ready(function(){
	var containerEl = document.querySelector('.mixitup-container');
	if(containerEl)
	{
		var config = {
			selectors:{
				target: '[data-ref="mixitup-target"]'
			},
			animation:{
				effects: 'fade scale stagger(50ms)' // Set a 'stagger' effect for the loading animation
			},
			load:{
				filter: 'none' // Ensure all targets start from hidden (i.e. display: none;)
			},
			animation:{
				duration: 350
			},
			controls:{
				scope: 'local'
			},
			callbacks: {
				onMixStart:function(state) {
				},
				onMixEnd:function() {
					InitLazyLoad();
				}
			}
		};
		var mixer = mixitup(containerEl, config);

		// Add a class to the container to remove 'visibility: hidden;' from targets. This
	    // prevents any flickr of content before the page's JavaScript has loaded.

	    containerEl.classList.add('mixitup-ready');

	    // Show all targets in the container

	    mixer.show()
		.then(function(){
			// Remove the stagger effect for any subsequent operations
			mixer.configure({
				animation: {
					effects: 'fade scale'
				}
			});
		});
	}

})