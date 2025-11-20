// Tracking functionality
document.addEventListener('DOMContentLoaded', function() {
    const trackingForm = document.getElementById('trackingForm');
    const trackingResults = document.getElementById('trackingResults');
    
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleTracking();
        });
    }
});

function handleTracking() {
    const trackingNumber = document.getElementById('trackingNumber').value.trim();
    const submitBtn = document.querySelector('#trackingForm button[type="submit"]');
    
    if (!trackingNumber) {
        alert('Please enter a tracking number');
        return;
    }
    
    // Add loading state
    addLoadingState(submitBtn);
    
    // Simulate API call
    setTimeout(() => {
        const mockTrackingData = generateMockTrackingData(trackingNumber);
        displayTrackingResults(mockTrackingData);
        removeLoadingState(submitBtn);
    }, 1500);
}

function generateMockTrackingData(trackingNumber) {
    const statuses = ['Package Picked Up', 'In Transit', 'Arrived at Distribution Center', 'Out for Delivery', 'Delivered'];
    const locations = [
        'New York, NY',
        'Philadelphia, PA', 
        'Chicago, IL',
        'Detroit, MI',
        'Cleveland, OH'
    ];
    
    const currentStatusIndex = Math.floor(Math.random() * (statuses.length - 1));
    const currentStatus = statuses[currentStatusIndex];
    
    // Generate timeline
    const timeline = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 3);
    
    for (let i = 0; i <= currentStatusIndex; i++) {
        const eventDate = new Date(baseDate);
        eventDate.setDate(eventDate.getDate() + i);
        
        timeline.push({
            status: statuses[i],
            location: locations[i % locations.length],
            date: eventDate.toISOString().split('T')[0],
            time: `${9 + i * 2}:${30 + i * 15} AM`,
            completed: true
        });
    }
    
    // Add future events
    for (let i = currentStatusIndex + 1; i < statuses.length; i++) {
        const eventDate = new Date(baseDate);
        eventDate.setDate(eventDate.getDate() + i);
        
        timeline.push({
            status: statuses[i],
            location: locations[i % locations.length],
            date: eventDate.toISOString().split('T')[0],
            time: 'Estimated',
            completed: false
        });
    }
    
    const estimatedDelivery = new Date(baseDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + statuses.length - 1);
    
    return {
        trackingNumber: trackingNumber,
        status: currentStatus,
        estimatedDelivery: estimatedDelivery.toISOString().split('T')[0],
        currentLocation: `${locations[currentStatusIndex % locations.length]} Distribution Center`,
        timeline: timeline
    };
}

function displayTrackingResults(data) {
    // Update tracking information
    document.getElementById('trackingNumberDisplay').textContent = `Tracking #: ${data.trackingNumber}`;
    document.getElementById('statusText').textContent = data.status;
    document.getElementById('currentLocation').textContent = `Current Location: ${data.currentLocation}`;
    document.getElementById('estimatedDelivery').textContent = `Estimated Delivery: ${data.estimatedDelivery}`;
    
    // Generate timeline
    const timelineContainer = document.getElementById('timeline');
    timelineContainer.innerHTML = '';
    
    data.timeline.forEach((event, index) => {
        const timelineEvent = document.createElement('div');
        timelineEvent.className = 'timeline-event';
        
        const iconClass = event.completed ? 'completed' : (event.status === 'Out for Delivery' ? 'current' : '');
        const contentClass = event.completed ? 'completed' : '';
        
        let icon = '⏳';
        if (event.completed) {
            icon = '✅';
        } else if (event.status === 'Out for Delivery') {
            icon = '🚛';
        }
        
        timelineEvent.innerHTML = `
            <div class="timeline-icon ${iconClass}">${icon}</div>
            <div class="timeline-content ${contentClass}">
                <h5>${event.status}</h5>
                <p>${event.location}</p>
                <p>${event.date} at ${event.time}</p>
            </div>
        `;
        
        timelineContainer.appendChild(timelineEvent);
    });
    
    // Show results
    document.getElementById('trackingResults').style.display = 'block';
    
    // Scroll to results
    document.getElementById('trackingResults').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}