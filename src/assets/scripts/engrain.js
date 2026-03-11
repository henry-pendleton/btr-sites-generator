/**
 * Engrain Integration
 * Fetches floor plan and availability data client-side
 */

(function() {
  const config = window.ENGRAIN_CONFIG;

  if (!config || !config.communityId) {
    console.log('Engrain: No community ID configured');
    return;
  }

  // Floor plans container
  const floorplansContainer = document.getElementById('floorplans-container');
  const floorplansPreview = document.getElementById('floorplans-preview');

  if (!floorplansContainer && !floorplansPreview) {
    return;
  }

  // Fetch floor plans from Engrain API
  async function fetchFloorPlans() {
    try {
      // Note: In production, this would go through your own API proxy
      // to avoid exposing API keys client-side
      const response = await fetch(`/api/engrain/floorplans?communityId=${config.communityId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch floor plans');
      }

      const data = await response.json();
      return data.floorPlans || [];
    } catch (error) {
      console.error('Engrain fetch error:', error);
      return [];
    }
  }

  // Render floor plans
  function renderFloorPlans(plans, container, limit = null) {
    if (!container) return;

    const displayPlans = limit ? plans.slice(0, limit) : plans;

    if (displayPlans.length === 0) {
      container.innerHTML = '<p class="text-center">Floor plan information coming soon.</p>';
      return;
    }

    container.innerHTML = displayPlans.map(plan => `
      <div class="floorplan-card">
        ${plan.image ? `<img src="${plan.image}" alt="${plan.name}" class="floorplan-image">` : ''}
        <div class="floorplan-details">
          <h3 class="floorplan-name">${plan.name}</h3>
          <div class="floorplan-specs">
            <span>${plan.beds} Bed</span>
            <span>${plan.baths} Bath</span>
            <span>${plan.sqft.toLocaleString()} sq ft</span>
          </div>
          ${plan.price ? `<p class="floorplan-price">From $${plan.price.toLocaleString()}/mo</p>` : ''}
          ${plan.available ? `<p class="floorplan-availability">${plan.available} Available</p>` : ''}
        </div>
      </div>
    `).join('');
  }

  // Initialize
  async function init() {
    const plans = await fetchFloorPlans();

    // Render preview (homepage)
    if (floorplansPreview) {
      renderFloorPlans(plans, floorplansPreview, 3);
    }

    // Render full list (floor plans page)
    if (floorplansContainer) {
      renderFloorPlans(plans, floorplansContainer);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
