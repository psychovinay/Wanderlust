    // Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if mapboxgl is available and mapToken is defined
    if (typeof mapboxgl !== 'undefined' && typeof mapToken !== 'undefined') {
        mapboxgl.accessToken = mapToken;
        
        // Get coordinates from data attributes or use default
        const mapContainer = document.getElementById('map');
        let listingCoords = [77.2090, 28.6139]; // Default coordinates (Delhi)
        let location = 'Unknown Location';
        let country = 'Unknown Country';
        
        if (mapContainer) {
            const coords = mapContainer.dataset.coordinates;
            const loc = mapContainer.dataset.location;
            const cnt = mapContainer.dataset.country;
            
            if (coords) {
                listingCoords = coords.split(',').map(Number);
            }
            if (loc) location = loc;
            if (cnt) country = cnt;
        }
        
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            center: listingCoords, // use coordinates [lng, lat]
            zoom: 12 // starting zoom
        });
        
        // Add a marker for the location
        new mapboxgl.Marker()
            .setLngLat(listingCoords)
            .addTo(map);
            
        // Add popup with location information
        new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(listingCoords)
            .setHTML(`<h4>${location}, ${country}</h4>`)
            .addTo(map);
            
    } else {
        console.error('Mapbox GL not loaded or mapToken not available');
        // Show error message to user
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Map temporarily unavailable. Please check back later.</div>';
        }
    }
});
