module.exports = function(grunt) {
	grunt.initConfig({
		gruntSite: {
			options: {
				indexPath: './../site/build/metrics/',
				group: {
					'COUNTS & SIZES': [
						'jsSize',
						'cssSize',
						'webfontSize',
						'jsCount',
						'cssCount',
						'webfontCount'
					],
					'REQUESTS': [
						'requests',
						'gzipRequests',
						'notFound'
					],
					'TIMINGS': [
						'timeToFirstByte',
						'timeToLastByte',
						'timeToFirstCss',
						'timeToFirstJs',
						'timeToFirstImage',
						'onDOMReadyTime',
						'onDOMReadyTimeEnd',
						'windowOnLoadTime',
						'windowOnLoadTimeEnd',
						'httpTrafficCompleted',
						'timeFrontend'
					],
					'JAVASCRIPT': [
						'eventsBound',
						'jsErrors',
						'globalVariables'
					],
					'DOM QUERIES': [
						'DOMqueries',
						'DOMqueriesById',
						'DOMqueriesByClassName',
						'DOMqueriesByTagName',
						'DOMqueriesByQuerySelectorAll',
						'DOMinserts',
						'DOMqueriesDuplicated',
						'jQuerySizzleCalls'
					]
				},
				url: 'http://www.frontendcore.com/content/carousel.html',
				buildUi: true
			}
		}
	});
};